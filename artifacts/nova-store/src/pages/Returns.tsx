import { RefreshCcw, ShieldCheck, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export function Returns() {
  return (
    <div className="py-20 animate-fade-in relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCcw className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-luxury text-gradient-gold">
            سياسة الاسترجاع والاستبدال
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            تسوق وأنت مطمئن تماماً! وضعنا شروط استرجاع مرنة وآمنة لنضمن لك تجربة شراء خالية من أي مخاطر.
          </p>
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-primary">
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              حق المعاينة الكاملة قبل الاستلام
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              من حقك الكامل معاينة المنتج عند استلامه من المندوب وقبل دفع أي مبلغ. إذا وجدت أن المنتج لا يطابق المواصفات المعروضة على الموقع أو لم ينل إعجابك، يمكنك بكل بساطة رفض الاستلام ولن تتكلف أي مصاريف إضافية (حتى مصاريف الشحن يتكفل بها المتجر في حال وجود عيب بالمنتج).
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-foreground">سياسة استرجاع مرنة خلال 14 يوماً</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">يحق للعميل استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ استلامه.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">يجب أن يكون المنتج في حالته الأصلية، غير مستخدم، وبكافة ملحقاته وعبوته الأصلية.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">في حالة وجود عيب صناعة، يتكفل المتجر بكافة مصاريف الشحن للاستبدال أو الاسترجاع.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                <span className="text-lg text-muted-foreground">في حال الرغبة في الاستبدال لتغيير المقاس أو اللون (بدون عيب)، يتحمل العميل تكلفة شحن الاستبدال الرمزية.</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl bg-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">خطوات طلب الاسترجاع</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              لإجراء عملية استرجاع أو استبدال، تواصل معنا فوراً عبر رقم الواتساب المخصص لخدمة العملاء. سيقوم أحد ممثلينا بمتابعة طلبك وإرسال المندوب لاستلام المرتجع في أسرع وقت.
            </p>
            <div className="mt-6 text-center">
              <Link href="/contact" className="text-primary font-bold text-lg hover:underline inline-flex items-center gap-2">
                تواصل معنا لطلب استرجاع
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
