import { ScrollText } from "lucide-react";

export function Terms() {
  return (
    <div className="py-20 animate-fade-in relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ScrollText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-6 font-luxury text-gradient-gold">
            الشروط والأحكام
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            مرحباً بك في NOVA Store. استخدامك للمتجر يعني موافقتك على الشروط والأحكام التالية، والتي تم وضعها لضمان حقوقك وحقوق المتجر معاً بشكل عادل.
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl space-y-8 text-muted-foreground leading-relaxed text-lg">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">1. شروط الاستخدام العام</h2>
            <p className="mb-4">
              باستخدامك لموقع NOVA Store للقيام بعملية شراء، فإنك تقر بأنك توافق على جميع الشروط والأحكام والسياسات الموضحة في هذه الصفحة، وتلتزم بها كعقد مُلزم.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">2. دقة المعلومات</h2>
            <p className="mb-4">
              نحن نبذل قصارى جهدنا لضمان أن جميع أسعار المنتجات وصورها ومواصفاتها دقيقة ومحدثة. ومع ذلك، نحتفظ بالحق في تصحيح أي أخطاء أو تحديث المعلومات في أي وقت دون إشعار مسبق. صور المنتجات المعروضة هي صور حقيقية وتمثل المنتج الفعلي الذي ستستلمه.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">3. الطلبات والتسعير</h2>
            <p className="mb-4">
              جميع الأسعار المعروضة في المتجر هي بالجنيه المصري (EGP). نحتفظ بالحق في قبول أو إلغاء أي طلب لعدة أسباب، منها عدم توفر مخزون أو اكتشاف خطأ في تسعير المنتج، وسيتم التواصل معك مباشرة في حالة الإلغاء.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">4. الدفع والاستلام</h2>
            <p className="mb-4">
              طريقة الدفع الأساسية المعتمدة هي الدفع نقداً عند الاستلام. يجب على العميل دفع قيمة الفاتورة ومصاريف الشحن لمندوب التوصيل بعد المعاينة وقبول المنتج بالكامل.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">5. سياسة الاسترجاع والاستبدال</h2>
            <p className="mb-4">
              تخضع عمليات الاسترجاع والاستبدال للسياسة المنشورة والمفصلة في صفحة "سياسة الاسترجاع". بشكل عام، يحق للعميل الإرجاع أو الاستبدال خلال 14 يوماً من الاستلام بشرط احتفاظ المنتج بحالته الأصلية وعبوته غير تالفة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">6. الخصوصية وبيانات العملاء</h2>
            <p className="mb-4">
              NOVA Store يتعهد بحماية بياناتك الشخصية (الاسم، رقم الهاتف، العنوان). نستخدم هذه البيانات فقط لغرض معالجة الطلبات وإرسال التحديثات لك. لن نقوم بمشاركة أو بيع بياناتك لأي جهة خارجية إطلاقاً.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
