import { useEffect } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const BASE = "https://noovaa.vercel.app";

export function Contact() {
  useEffect(() => {
    document.title = "تواصل معنا | NOVA Store نوفا ستور - واتساب، هاتف، بريد إلكتروني";
    const setMeta = (name: string, val: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMeta('description', 'تواصل مع نوفا ستور الآن - عبر واتساب 01005209667 أو هاتف. خدمة عملاء يومياً من 10 صباحاً حتى 10 مساءً.');
    setMeta('og:title', 'تواصل معنا | نوفا ستور NOVA Store', 'property');
    setMeta('og:url', `${BASE}/contact`, 'property');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${BASE}/contact`;

    const old = document.getElementById('contact-jsonld');
    if (old) old.remove();
    const s = document.createElement('script');
    s.id = 'contact-jsonld';
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "تواصل مع نوفا ستور",
      "url": `${BASE}/contact`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "نوفا ستور", "item": `${BASE}/` },
          { "@type": "ListItem", "position": 2, "name": "تواصل معنا", "item": `${BASE}/contact` }
        ]
      },
      "mainEntity": {
        "@type": "Organization",
        "name": "NOVA Store",
        "telephone": "+201005209667",
        "email": "ahmedmhram3@gmail.com",
        "contactPoint": [{
          "@type": "ContactPoint",
          "telephone": "+201005209667",
          "contactType": "customer service",
          "areaServed": "EG",
          "availableLanguage": ["Arabic"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "opens": "10:00",
            "closes": "22:00",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
          }
        }]
      }
    });
    document.head.appendChild(s);

    return () => {
      document.title = 'NOVA Store | نوفا ستور';
      document.getElementById('contact-jsonld')?.remove();
      const c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (c) c.href = `${BASE}/`;
    };
  }, []);


  return (
    <div className="py-20 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-luxury text-gradient-gold">
            تواصل معنا
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نحن هنا من أجلك في أي وقت. فريق خدمة العملاء مكرس لتقديم أفضل مساعدة ممكنة لضمان تجربة تسوق مذهلة. خذ راحتك في التواصل معنا عبر أي من القنوات التالية وسيتم الرد عليك فوراً.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">اتصل بنا هاتفياً</h3>
            <p className="text-muted-foreground mb-4">نستقبل مكالماتكم بكل ترحيب طوال أيام الأسبوع.</p>
            <a href="tel:01005209667" className="text-primary font-bold text-xl hover:underline" dir="ltr">01005209667</a>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">واتساب</h3>
            <p className="text-muted-foreground mb-4">تواصل معنا عبر واتساب للرد الفوري السريع.</p>
            <a href="https://wa.me/201005209667" target="_blank" rel="noreferrer" className="text-green-500 font-bold text-xl hover:underline">اضغط هنا للمحادثة</a>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 lg:col-span-1 md:col-span-2">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">البريد الإلكتروني</h3>
            <p className="text-muted-foreground mb-4">للاستفسارات الرسمية والشكاوى والمقترحات.</p>
            <a href="mailto:ahmedmhram3@gmail.com" className="text-blue-500 font-bold text-lg hover:underline">ahmedmhram3@gmail.com</a>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl text-center">
          <Clock className="w-12 h-12 mx-auto text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-foreground">أوقات العمل</h2>
          <p className="text-xl text-muted-foreground mb-2">خدمة العملاء متوفرة لخدمتكم <strong>يومياً من الساعة 10 صباحاً حتى 10 مساءً</strong>.</p>
          <p className="text-lg text-muted-foreground">نوفر دعماً استثنائياً حتى في أوقات الذروة لأن راحتكم هي أولويتنا القصوى.</p>
        </div>
      </div>
    </div>
  );
}
