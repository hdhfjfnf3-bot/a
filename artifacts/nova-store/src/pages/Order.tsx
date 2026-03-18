import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetProduct, useCreateOrder, useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, MessageCircle, Phone, Smartphone, Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/* ═══════════ المحافظات والمدن ═══════════ */
const EGYPT_GOVERNORATES = [
  "القاهرة","الجيزة","الإسكندرية","الشرقية","الدقهلية","البحيرة","المنوفية",
  "الغربية","القليوبية","كفر الشيخ","دمياط","بورسعيد","الإسماعيلية","السويس",
  "شمال سيناء","جنوب سيناء","الفيوم","بني سويف","المنيا","أسيوط","سوهاج",
  "قنا","الأقصر","أسوان","البحر الأحمر","الوادي الجديد","مطروح"
];

const GOVERNORATE_CITIES: Record<string, string[]> = {
  "القاهرة":["مدينة نصر","مصر الجديدة","شبرا","الزيتون","بولاق","السلام","المطرية","المعادي","حلوان","المقطم","6 أكتوبر","العباسية","الدقي","مصر القديمة"],
  "الجيزة":["الهرم","فيصل","بولاق الدكرور","إمبابة","العجوزة","الدقي","الجيزة","كيتكات","سمنود","بدرشين"],
  "الإسكندرية":["العجمي","محرم بك","المنتزه","اللبان","سيدي بشر","الرمل","البكوة","برج العرب","العامرية","الدخيلة"],
  "الشرقية":["الزقازيق","بلبيس","منيا القمح","العبور","القنطرة","فاقوس","أبو كبير"],
  "الدقهلية":["المنصورة","طلخا","آجا","نبروه","شربين","جمصة","ميت غمر"],
  "البحيرة":["دمنهور","كفر الدوار","المحمودية","رشيد","أبو حمص","إيتاي البارود"],
  "المنوفية":["شبين الكوم","منوف","سرس الليان","بركة السبع","قويسنا"],
  "الغربية":["طنطا","المحلة الكبرى","كفر الزيات","زفتى","سمنود","بسيون"],
  "القليوبية":["بنها","قليوب","شبرا الخيمة","الخصوص","وادي النطرون","كفر شكر"],
  "كفر الشيخ":["كفر الشيخ","دسوق","فوة","سيدي سالم","بيلا المدينة","برلس"],
  "دمياط":["دمياط","فارسكور","كفر سعد","رأس البر"],
  "بورسعيد":["بورسعيد"],
  "الإسماعيلية":["الإسماعيلية","القنطرة","أبو صوير","فايد"],
  "السويس":["السويس","عتاقة"],
  "شمال سيناء":["العريش","رفح","الشيخ زويد","نخل"],
  "جنوب سيناء":["الطور","شرم الشيخ","دهب","نويبع","سانت كاترين"],
  "الفيوم":["الفيوم","سنورس","إطسا","طامية"],
  "بني سويف":["بني سويف","الواسطى","ببا","سمسطا"],
  "المنيا":["المنيا","ملوي","مغاغة","أبو قرقاص","سمالوط"],
  "أسيوط":["أسيوط","منفلوط","ضروط"],
  "سوهاج":["سوهاج","أخميم","جرجا","طهطا"],
  "قنا":["قنا","نجع حمادي","دشنا","إسنا"],
  "الأقصر":["الأقصر","الكرنك","أرمنت"],
  "أسوان":["أسوان","كوم أمبو","إدفو","دراو"],
  "البحر الأحمر":["الغردقة","سفاجا","مرسى علم","القصير"],
  "الوادي الجديد":["الخارجة","الداخلة","الفرافرة"],
  "مطروح":["مرسى مطروح","الضبعية","سيوة"],
};

/* ═══════════ Zod Schema ═══════════ */
const orderSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
  phone: z.string().regex(/^1[0125][0-9]{8}$/, "رقم هاتف غير صحيح (اكتب بدون +20)"),
  altPhone: z.string().regex(/^1[0125][0-9]{8}$/, "رقم هاتف غير صحيح").optional().or(z.literal("")),
  governorate: z.string().min(1, "اختر المحافظة"),
  street: z.string().min(5, "أدخل اسم الشارع ورقم المبنى"),
  apartment: z.string().min(1, "أدخل رقم الشقة أو الوحدة"),
  city: z.string().min(2, "اختر المدينة"),
  postalCode: z.string().optional(),
  quantity: z.coerce.number().min(1).max(10),
  facebookPage: z.string().optional(),
  notes: z.string().optional(),
});
type OrderFormValues = z.infer<typeof orderSchema>;

/* ═══════════ شات الدعم ═══════════ */
const WHATSAPP_NUMBER = "201005209667";

interface ChatMessage { from: "user" | "support"; text: string; time: string; }

function SupportChat({ orderRef, productName }: { orderRef: string; productName: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "support", text: `مرحباً! تم استلام طلبك رقم ${orderRef} ✅\nهل تحتاج أي مساعدة؟`, time: "الآن" }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { from: "user", text: input.trim(), time: now }]);
    setInput("");
    // رسالة على واتساب
    const waText = encodeURIComponent(`[دعم طلب ${orderRef}]\n${input.trim()}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, "_blank");
    // رد تلقائي
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: "support",
        text: "شكراً لتواصلك! سيرد أحمد محرم عليك قريباً عبر واتساب 🙏",
        time: new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })
      }]);
    }, 1500);
  };

  return (
    <>
      {/* زر الشات العائم */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full" />
      </motion.button>

      {/* نافذة الشات */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-24 left-4 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: "#0f0a04" }}
        >
          {/* Header */}
          <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">دعم NOVA — أحمد محرم</p>
                <p className="text-green-200 text-xs">متصل الآن</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${m.from === "user" ? "bg-green-600 text-white" : "bg-white/10 text-white"}`}>
                  {m.text}
                  <span className="block text-[10px] opacity-60 mt-1">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="اكتب رسالتك..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-green-500/50"
            />
            <button onClick={sendMsg} className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-500 transition-colors">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ═══════════ صفحة الأوردر ═══════════ */
export function OrderPage() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  const productId = parseInt(params.id || "0");
  const { data: product, isLoading: isLoadingProduct } = useGetProduct(productId);
  const { data: user, isLoading: isLoadingUser } = useGetMe({ query: { retry: false, queryKey: ['/api/auth/me'] } });
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [payMethod, setPayMethod] = useState<"whatsapp" | "vodafone">("whatsapp");

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: { onSuccess: (res: any) => {
      setOrderId(res?.data?.id?.toString() || Math.random().toString(36).slice(2, 8).toUpperCase());
      setIsSuccess(true);
    }}
  });

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1, governorate: "" }
  });

  // Autofill user data
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        phone: user.phone || "",
        quantity: 1,
        governorate: "",
      });
    }
  }, [user, reset]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoadingUser && !user) {
      setLocation(`/login?redirect=/order/${productId}`);
    }
  }, [user, isLoadingUser, setLocation, productId]);

  const watchQty    = watch("quantity", 1);
  const watchGov    = watch("governorate", "");
  const cityOptions = GOVERNORATE_CITIES[watchGov] || [];
  const total       = (product?.price || 0) * (watchQty || 1);

  const onSubmit = (data: OrderFormValues) => {
    if (!product) return;
    const fullAddress = [data.street, `شقة/وحدة: ${data.apartment}`, data.city, data.postalCode ? `ر.ب: ${data.postalCode}` : null].filter(Boolean).join(" - ");

    createOrder({
      data: {
        productId: product.id,
        fullName: data.fullName,
        phone: "+20" + data.phone,
        altPhone: data.altPhone ? "+20" + data.altPhone : undefined,
        governorate: data.governorate,
        address: fullAddress,
        quantity: data.quantity,
        facebookPage: data.facebookPage,
        notes: data.notes,
      }
    });

    // رسالة واتساب تلقائية
    const waMsg = `🛍️ طلب جديد من متجر NOVA
━━━━━━━━━━━━━━━━━
👤 الاسم: ${data.fullName}
📱 رقم الهاتف: +20${data.phone}
📦 المنتج: ${product.nameAr || product.name}
🔢 الكمية: ${data.quantity}
💰 الإجمالي: ${total.toLocaleString("ar")} جنيه
💳 طريقة الدفع: ${payMethod === "vodafone" ? "فودافون كاش" : "واتساب"}
📍 المحافظة: ${data.governorate}
🏠 العنوان: ${fullAddress}
${data.facebookPage ? `📘 فيسبوك: ${data.facebookPage}` : ""}
${data.notes ? `📝 ملاحظات: ${data.notes}` : ""}
━━━━━━━━━━━━━━━━━`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`, "_blank");
  };

  /* شاشة النجاح */
  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full glass-panel-gold rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">تم الطلب بنجاح! 🎉</h2>
          <p className="text-muted-foreground mb-2">رقم طلبك: <span className="text-primary font-bold">#{orderId}</span></p>
          <p className="text-muted-foreground mb-6 text-sm">تم إرسال تفاصيل طلبك على واتساب أحمد محرم تلقائياً.</p>

          {/* خطوات الدفع */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-right space-y-3">
            <h3 className="font-bold text-white text-center mb-3">📋 خطوات إتمام الدفع</h3>
            {payMethod === "vodafone" ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>افتح تطبيق فودافون كاش</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>اختر "دفع فواتير" ثم "محفظة"</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>أرسل <strong className="text-primary">{total.toLocaleString("ar")} جنيه</strong> لرقم <strong className="text-primary" dir="ltr">01005209667</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>أرسل صورة الإيصال على واتساب</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>سيتواصل معك أحمد محرم على واتساب قريباً</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>سيتم تأكيد العنوان وتحديد موعد التوصيل</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>خيارات دفع آمنة 100%</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-500 gap-2">
                <MessageCircle className="w-4 h-4" /> تواصل واتساب
              </Button>
            </a>
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">العودة للتسوق</Button>
            </Link>
          </div>
        </motion.div>

        {/* شات الدعم */}
        <SupportChat orderRef={orderId} productName={product?.nameAr || product?.name || ""} />
      </div>
    );
  }

  if (isLoadingProduct || isLoadingUser) return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return null; // Wait for redirect
  if (!product) return <div className="min-h-screen pt-32 text-center text-xl">المنتج غير موجود</div>;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href={`/products/${product.id}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 group">
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />رجوع
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── النموذج ── */}
          <div className="lg:col-span-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gradient-gold">بيانات الشحن</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* الاسم */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاسم بالكامل *</label>
                  <Input {...register("fullName")} error={!!errors.fullName} placeholder="أدخل اسمك كاملاً" />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>

                {/* الهاتف */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium">رقم المحمول *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono" dir="ltr">+20</span>
                      <Input {...register("phone")} error={!!errors.phone} dir="ltr" className="pl-14 text-left font-mono" placeholder="1001234567" />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">رقم بديل (اختياري)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono" dir="ltr">+20</span>
                      <Input {...register("altPhone")} error={!!errors.altPhone} dir="ltr" className="pl-14 text-left font-mono" placeholder="1001234567" />
                    </div>
                  </div>
                </div>

                {/* العنوان */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-2xl">🇪🇬</span>
                    <span className="font-bold text-lg">مصر — بيانات العنوان</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* المحافظة */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">المحافظة *</label>
                      <select {...register("governorate")} className={`flex h-14 w-full rounded-xl border bg-background/50 px-4 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all ${errors.governorate ? "border-destructive" : "border-border"}`}>
                        <option value="">اختر المحافظة...</option>
                        {EGYPT_GOVERNORATES.map(g => <option key={g} value={g} className="bg-background">{g}</option>)}
                      </select>
                      {errors.governorate && <p className="text-xs text-destructive">{errors.governorate.message}</p>}
                    </div>

                    {/* المدينة */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">المدينة / المنطقة *</label>
                      <select {...register("city")} disabled={!watchGov} className={`flex h-14 w-full rounded-xl border bg-background/50 px-4 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 ${errors.city ? "border-destructive" : "border-border"}`}>
                        <option value="">{watchGov ? "اختر المدينة..." : "اختر المحافظة أولاً"}</option>
                        {cityOptions.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                      </select>
                      {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <label className="text-sm font-medium">الشارع ورقم المبنى *</label>
                    <Input {...register("street")} error={!!errors.street} placeholder="مثال: شارع التحرير، عمارة 12، بجوار مسجد النور" />
                    {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">رقم الشقة / الوحدة *</label>
                      <Input {...register("apartment")} error={!!errors.apartment} placeholder="مثال: شقة 5، الدور 3" />
                      {errors.apartment && <p className="text-xs text-destructive">{errors.apartment.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">الرقم البريدي (اختياري)</label>
                      <Input {...register("postalCode")} dir="ltr" className="text-left font-mono" placeholder="مثال: 11511" />
                    </div>
                  </div>
                </div>

                {/* الكمية */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">الكمية *</label>
                  <Input type="number" min="1" max="10" {...register("quantity")} error={!!errors.quantity} />
                  {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
                </div>

                {/* طريقة الدفع */}
                <div className="pt-4 border-t border-white/10">
                  <label className="text-sm font-medium block mb-4">طريقة الدفع *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button type="button" onClick={() => setPayMethod("whatsapp")} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${payMethod === "whatsapp" ? "border-green-500 bg-green-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">واتساب</p>
                        <p className="text-xs text-muted-foreground">التواصل والدفع عبر واتساب</p>
                      </div>
                      {payMethod === "whatsapp" && <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-auto"><span className="text-white text-xs">✓</span></div>}
                    </button>

                    <button type="button" onClick={() => setPayMethod("vodafone")} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${payMethod === "vodafone" ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                      <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">فودافون كاش</p>
                        <p className="text-xs text-muted-foreground">تحويل على 01005209667</p>
                      </div>
                      {payMethod === "vodafone" && <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mr-auto"><span className="text-white text-xs">✓</span></div>}
                    </button>
                  </div>
                </div>

                {/* فيسبوك */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">رابط فيسبوك (اختياري)</label>
                  <Input {...register("facebookPage")} dir="ltr" className="text-left" placeholder="https://facebook.com/..." />
                </div>

                {/* ملاحظات */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">ملاحظات (اختياري)</label>
                  <Textarea {...register("notes")} placeholder="أي ملاحظات إضافية بخصوص الطلب..." />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg mt-4 h-16 shadow-primary/30 shadow-xl gap-2" isLoading={isPending}>
                  <Send className="w-5 h-5" />
                  تأكيد الطلب وإرسال على واتساب
                </Button>
                <p className="text-center text-xs text-muted-foreground">سيتم فتح واتساب تلقائياً لتأكيد طلبك مع أحمد محرم</p>
              </form>
            </motion.div>
          </div>

          {/* ── ملخص الطلب ── */}
          <div className="lg:col-span-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="glass-panel-gold rounded-3xl p-6 sticky top-28">
              <h3 className="text-lg font-bold mb-5 text-gradient-gold">ملخص الطلب</h3>

              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  <img src={product.images?.[0] || ""} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold line-clamp-2">{product.nameAr || product.name}</h4>
                  <p className="text-primary mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>السعر</span><span>{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الكمية</span><span>{watchQty}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>مصاريف الشحن</span>
                  <span className="text-green-500 font-medium">تحدد لاحقاً</span>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-lg font-bold">الإجمالي</span>
                  <span className="text-2xl font-bold text-gradient-gold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* طريقة الدفع المعروضة */}
              <div className={`mt-6 p-3 rounded-xl border flex items-center gap-2 text-sm ${payMethod === "vodafone" ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-green-500/10 border-green-500/30 text-green-300"}`}>
                {payMethod === "vodafone" ? <Smartphone className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                {payMethod === "vodafone" ? "فودافون كاش — رقم 01005209667" : "واتساب — سيتواصل معك أحمد محرم"}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-3 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                ضمان استرداد كامل في حال عدم التوصيل
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
