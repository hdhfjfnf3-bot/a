import { useEffect } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const BASE = "https://noovaa.vercel.app";

const faqs = [
  {
    question: "هل يمكنني معاينة الطلب قبل الدفع والاستلام؟",
    answer: "نعم بالتأكيد! نحن نضمن لك حق فتح الشحنة ومعاينتها بالكامل قبل دفع أي مبلغ للمندوب. إذا لم يعجبك المنتج يمكنك رفض الاستلام دون دفع مصاريف الشحن."
  },
  {
    question: "متى سيصلني الطلب بعد تأكيده؟",
    answer: "نحن نفخر بسرعة التوصيل لدينا. عادة ما يصل الطلب خلال 2 إلى 4 أيام عمل حسب محافظتك."
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نقدم خيارات دفع مريحة وآمنة وموثوقة لضمان تجربة تسوق سلسة وفاخرة تليق بعملائنا الموقرين."
  },
  {
    question: "ماذا أفعل إذا استلمت منتجأً به عيب أو غير مطابق للطلب؟",
    answer: "لا تقلق أبداً! تواصل مع خدمة العملاء الخاص بنا في أسرع وقت. سنقوم باستبدال المنتج مجاناً وبدون أي تكلفة شحن إضافية عليك أو استرداد المبلغ بالكامل بناءً على رغبتك."
  },
  {
    question: "هل المنتجات المعروضة أصلية ومطابقة للصور؟",
    answer: "جميع الصور في متجرنا هي صور حقيقية للمنتجات. نحن ننتقي منتجاتنا بعناية فائقة من أفضل المصادر لنضمن لك جودة تليق بك (High-End Quality)."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = "الأسئلة الشائعة | NOVA Store نوفا ستور - إجابات لكل استفساراتك";
    const setMeta = (name: string, val: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMeta('description', 'إجابات لأكثر الأسئلة شيوعاً عن نوفا ستور: خيارات الدفع الآمنة، مدة التوصيل، ضمان الجودة، وسياسة الاستبدال.');
    setMeta('og:title', 'الأسئلة الشائعة | نوفا ستور NOVA Store', 'property');
    setMeta('og:url', `${BASE}/faq`, 'property');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${BASE}/faq`;

    // FAQPage JSON-LD — يظهر كـ accordion مباشرة في نتائج جوجل!
    const old = document.getElementById('faq-jsonld');
    if (old) old.remove();
    const s = document.createElement('script');
    s.id = 'faq-jsonld';
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    });
    document.head.appendChild(s);

    return () => {
      document.title = 'NOVA Store | نوفا ستور';
      document.getElementById('faq-jsonld')?.remove();
      const c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (c) c.href = `${BASE}/`;
    };
  }, []);



  return (
    <div className="py-20 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-6 font-luxury text-gradient-gold">
            الأسئلة الشائعة
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            جمعنا لك إجابات لأكثر الأسئلة شیوعاً لتكون على دراية تامة بكل التفاصيل. وإذا كان لديك أي سؤال آخر، لا تتردد في مراسلتنا!
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`glass-panel border rounded-xl overflow-hidden transition-all duration-300 ${
                openIndex === index ? "border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "border-white/5 hover:border-white/10"
              }`}
            >
              <button
                className="w-full text-right p-6 flex items-center justify-between gap-4 font-bold text-lg text-foreground"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-muted-foreground text-lg leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
