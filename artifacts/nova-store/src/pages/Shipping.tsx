import { Truck, PackageCheck, Zap, Wallet } from "lucide-react";
import { Link } from "wouter";

export function Shipping() {
  return (
    <div className="py-20 animate-fade-in relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-luxury text-gradient-gold">
            الشحن والتوصيل
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            توصيل سريع، آمن، ومضمون إلى باب منزلك في أي مكان في مصر. لأننا نعلم مدى حماسك لاستلام طلبك، جعلنا عملية الشحن أولويتنا.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-panel p-8 rounded-2xl flex items-start gap-4">
            <Zap className="w-8 h-8 text-yellow-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">سرعة فائقة في التوصيل</h3>
              <p className="text-muted-foreground">يتم تجهيز طلبك وشحنه فور تأكيده. تصلك الشحنة خلال 2 إلى 4 أيام عمل كحد أقصى لتستمتع بمشترياتك في أسرع وقت.</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex items-start gap-4">
            <Wallet className="w-8 h-8 text-green-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">دفع آمن ومضمون</h3>
              <p className="text-muted-foreground">لأن راحتك تهمنا، نوفر لك خيارات دفع مرنة وآمنة لتستمتع بتجربة تسوق لا مثيل لها.</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex items-start gap-4">
            <PackageCheck className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">تغليف آمن واحترافي</h3>
              <p className="text-muted-foreground">نضمن لك وصول المنتج في أبهى صورة. نعتمد على أفضل مواد التغليف لحماية منتجك من أي أضرار أثناء النقل.</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex items-start gap-4">
            <Truck className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">تغطية شاملة</h3>
              <p className="text-muted-foreground">شبكة شركائنا لخدمات الشحن تغطي جميع مدن ومحافظات جمهورية مصر العربية لضمان وصولنا إليك أينما كنت.</p>
            </div>
          </div>
        </div>

        <div className="text-center bg-primary/5 p-8 border border-primary/20 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 text-foreground">تتبع شحنتك بكل سهولة</h2>
          <p className="text-lg text-muted-foreground mb-6">
            فور خروج طلبك للشحن، سنقوم بإرسال رسالة لتأكيد الشحن وتزويدك بمعلومات التواصل مع المندوب. كما يمكنك دائماً التواصل مع خدمة العملاء لمعرفة حالة الطلب.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            تواصل مع خدمة العملاء
          </Link>
        </div>
      </div>
    </div>
  );
}
