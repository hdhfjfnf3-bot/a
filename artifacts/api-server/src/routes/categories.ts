import { Router } from "express";
import { supabase, db, categoriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .select("*, products(count)");
      if (error) throw error;
      res.json((data ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        nameAr: c.name_ar,
        slug: c.slug,
        icon: c.icon,
        image: c.image,
        productCount: c.products?.[0]?.count ?? 0,
      })));
      return;
    }

    const categories = await db.select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      nameAr: categoriesTable.nameAr,
      slug: categoriesTable.slug,
      icon: categoriesTable.icon,
      image: categoriesTable.image,
      productCount: sql<number>`(select count(*) from products where category_id = ${categoriesTable.id})`,
    }).from(categoriesTable);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, nameAr, slug, icon, image } = req.body;
    if (!name || !nameAr || !slug) {
      res.status(400).json({ error: "الاسم والرابط مطلوبان" });
      return;
    }

    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name, name_ar: nameAr, slug, icon, image })
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ id: data.id, name: data.name, nameAr: data.name_ar, slug: data.slug, icon: data.icon, image: data.image, productCount: 0 });
      return;
    }

    const [category] = await db.insert(categoriesTable).values({ name, nameAr, slug, icon, image }).returning();
    res.status(201).json({ ...category, productCount: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
