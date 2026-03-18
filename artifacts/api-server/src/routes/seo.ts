// @ts-nocheck
import { Router } from "express";
import { supabase, db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const BASE_URL = "https://noovaa.vercel.app";

// 1. Dynamic Sitemap
router.get("/sitemap.xml", async (_req, res) => {
  try {
    let products = [];
    if (supabase) {
      const { data } = await supabase.from("products").select("id, created_at");
      products = data || [];
    } else {
      products = await db.select({ id: productsTable.id, createdAt: productsTable.createdAt }).from(productsTable);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${BASE_URL}/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${products.map(p => `
  <url>
    <loc>${BASE_URL}/products/${p.id}</loc>
    <lastmod>${new Date(p.created_at || p.createdAt || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap.trim());
  } catch (err) {
    console.error("Sitemap generation error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

// 2. Server-Side OG Injection for Social Crawlers
// When WhatsApp/Facebook requests /products/:id, Vercel will rewrite it to /api/seo/product/:id
// If it's a bot, we serve a tiny HTML with meta tags. If it's a real user, we redirect to the actual frontend.
router.get("/products/:id", async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"] || "";
    // Check if the requester is a social media crawler
    const isBot = /facebookexternalhit|WhatsApp|TelegramBot|Twitterbot|LinkedInBot|Slackbot/i.test(userAgent);

    const productId = Number(req.params.id);
    let product;

    if (supabase) {
      const { data } = await supabase.from("products").select("*").eq("id", productId).single();
      product = data;
    } else {
      const [p] = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
      product = p;
    }

    if (!product) {
      if (isBot) return res.status(404).send("Product Not Found");
      return res.redirect(302, `/products`);
    }

    const title = `${product.name_ar || product.nameAr} | نوفا ستور`;
    const desc = `${product.description_ar || product.descriptionAr || "اشتري الآن من نوفا ستور بأفضل الأسعار المتاحة!"} - السعر: ${product.price} جنيه`;
    let image = (product.images && product.images[0]) ? product.images[0] : `${BASE_URL}/images/nova-logo-real.jpg`;
    if (image.startsWith('/')) image = `${BASE_URL}${image}`;

    const productUrl = `${BASE_URL}/products/${product.id}`;

    if (isBot) {
      // Serve pure HTML with Meta Tags for the Bot
      const html = `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${productUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="NOVA Store" />
  <meta property="product:price:amount" content="${product.price}" />
  <meta property="product:price:currency" content="EGP" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${desc}</p>
  <img src="${image}" alt="${title}" />
</body>
</html>`;
      return res.send(html);
    } else {
      // It's a real user. We actually shouldn't redirect them away from the SPA URL if Vercel handles the route correctly.
      // But since we are intercepting the EXACT URL in Vercel rewrite, we need to instruct Vercel correctly.
      // The best design is: Vercel rewrite only triggers for bots, OR we serve the index.html here.
      // Easiest is to redirect back to the client side without the rewrite loop.
      // Wait, if vercel rewrites `/products/:id` to here, and we redirect to `/products/:id`, it loops.
      // Instead, we will configure vercel.json to only rewrite specific bot user-agents if possible, but vercel.json doesn't support user-agent regex easily.
      // The reliable way is to fetch the built index.html and inject the meta tags, then serve it!
      
      const fetchReq = await fetch(`${BASE_URL}/index.html`);
      let baseHtml = await fetchReq.text();
      
      // Inject tags into <head>
      const injection = `
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${productUrl}" />
  <meta property="og:type" content="product" />
  <meta property="product:price:amount" content="${product.price}" />
  <meta property="product:price:currency" content="EGP" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${image}" />
      `;
      
      baseHtml = baseHtml.replace('</head>', `${injection}</head>`);
      return res.send(baseHtml);
    }

  } catch (err) {
    console.error("SEO Endpoint error:", err);
    res.status(500).send("Server Error");
  }
});

export default router;
