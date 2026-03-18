import { useEffect } from "react";
import { ShieldCheck, Star, Clock, HeartHandshake } from "lucide-react";
import { Link } from "wouter";

const BASE = "https://noovaa.vercel.app";

export function About() {
  useEffect(() => {
    document.title = "من نحن | NOVA Store نوفا ستور - متجر إلكتروني موثوق في مصر";
    const setMeta = (name: string, val: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMeta('description', 'تعرف على نوفا ستور - متجر إلكتروني موثوق في مصر يقدم منتجات فاخرة أصلية بضمان الجودة والدفع عند الاستلام.');
    setMeta('og:title', 'من نحن | نوفا ستور NOVA Store', 'property');
    setMeta('og:url', `${BASE}/about`, 'property');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${BASE}/about`;

    // Organization JSON-LD
    const old = document.getElementById('about-jsonld');
    if (old) old.remove();
    const s = document.createElement('script');
    s.id = 'about-jsonld';
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "من نحن - NOVA Store",
      "url": `${BASE}/about`,
      "description": "تعرف على نوفا ستور، المتجر الإلكتروني المتخصص في المنتجات الفاخرة بمصر",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "نوفا ستور", "item": `${BASE}/` },
          { "@type": "ListItem", "position": 2, "name": "من نحن", "item": `${BASE}/about` }
        ]
      }
    });
    document.head.appendChild(s);

    return () => {
      document.title = 'NOVA Store | نوفا ستور';
      document.getElementById('about-jsonld')?.remove();
      const c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (c) c.href = `${BASE}/`;
    };
  }, []);


  return (
    <div className="py-20 animate-fade-in relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-luxury text-gradient-gold">
            من نحن
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            مرحباً بك في <span className="text-primary font-bold">NOVA Store</span>، 
            وجهتك الأولى التي تجمع بين الفخامة، الجودة الاستثنائية، والمصداقية التامة.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">قصتنا</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              انطلقنا برؤية واضحة: تغيير مفهوم التسوق الإلكتروني في مصر والوطن العربي. نحن لا نبيع مجرد منتجات، بل نقدم تجربة تسوق راقية تلبي تطلعاتك. يتم فحص كل منتج يعرض في متجرنا بعناية فائقة لضمان حصولك على أعلى درجات الجودة وبسعر يمنحك القيمة الحقيقية.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              رضاؤك التام هو غايتنا. لقد بنينا متجرنا على أسس من الشفافية والأمان لنضمن لك راحة البال من اللحظة الأولى لدخولك متجرنا وحتى استلام طلبك وبدء استخدامه.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold mb-6 text-primary">لماذا يتسوق الآلاف من NOVA؟</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">جودة منتقیة بعناية لتناسب أصحاب الذوق الرفيع.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">حق المعاينة الكامل قبل الاستلام لضمان مطابقة الوصف.</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">توصيل سريع يغطي جميع محافظات الجمهورية.</span>
              </li>
              <li className="flex items-start gap-3">
                <HeartHandshake className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">خدمة عملاء مميزة متواجدة دائماً لخدمتك وحل أي مشكلة.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
            تسوق الآن واكتشف الجودة
          </Link>
        </div>
      </div>
    </div>
  );
}
