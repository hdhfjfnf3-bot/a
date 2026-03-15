import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetProduct, useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const EGYPT_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية", "البحيرة", "المنوفية",
  "الغربية", "القليوبية", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس",
  "شمال سيناء", "جنوب سيناء", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج",
  "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح"
];

const orderSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
  phone: z.string().regex(/^1[0125][0-9]{8}$/, "رقم هاتف غير صحيح (اكتب بدون +20)"),
  altPhone: z.string().regex(/^1[0125][0-9]{8}$/, "رقم هاتف غير صحيح").optional().or(z.literal("")),
  governorate: z.string().min(1, "اختر المحافظة"),
  address: z.string().min(10, "العنوان يجب أن يكون مفصلاً"),
  quantity: z.coerce.number().min(1).max(10),
  facebookPage: z.string().optional(),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export function OrderPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const productId = parseInt(params.id || "0");
  const { data: product, isLoading: isLoadingProduct } = useGetProduct(productId);
  
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: () => setIsSuccess(true),
    }
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1, governorate: "" }
  });

  const watchQty = watch("quantity", 1);
  const total = (product?.price || 0) * (watchQty || 1);

  const onSubmit = (data: OrderFormValues) => {
    if (!product) return;
    createOrder({
      data: {
        productId: product.id,
        fullName: data.fullName,
        phone: "+20" + data.phone,
        altPhone: data.altPhone ? "+20" + data.altPhone : undefined,
        governorate: data.governorate,
        address: data.address,
        quantity: data.quantity,
        facebookPage: data.facebookPage,
        notes: data.notes
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-md w-full glass-panel-gold rounded-3xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">تم الطلب بنجاح!</h2>
          <p className="text-muted-foreground mb-8">
            شكراً لثقتك في NOVA. سيتواصل معك فريقنا قريباً لتأكيد طلبك.
          </p>
          <Link href="/products">
            <Button className="w-full">العودة للتسوق</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoadingProduct) return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!product) return <div className="min-h-screen pt-32 text-center text-xl">المنتج غير موجود</div>;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href={`/products/${product.id}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 group">
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          رجوع
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Order Form */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="glass-panel p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-gradient-gold">بيانات الشحن</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاسم بالكامل *</label>
                  <Input {...register("fullName")} error={!!errors.fullName} placeholder="أدخل اسمك كاملاً" />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium">رقم المحمول (بالحروف الانجليزية) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono" dir="ltr">+20</span>
                      <Input {...register("phone")} error={!!errors.phone} dir="ltr" className="pl-14 text-left font-mono" placeholder="1001234567" />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium">الرقم البديل (اختياري)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono" dir="ltr">+20</span>
                      <Input {...register("altPhone")} error={!!errors.altPhone} dir="ltr" className="pl-14 text-left font-mono" placeholder="1001234567" />
                    </div>
                    {errors.altPhone && <p className="text-xs text-destructive">{errors.altPhone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">المحافظة *</label>
                    <select 
                      {...register("governorate")}
                      className={`flex h-14 w-full rounded-xl border bg-background/50 px-4 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all ${errors.governorate ? "border-destructive" : "border-border"}`}
                    >
                      <option value="">اختر المحافظة...</option>
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov} value={gov} className="bg-background text-foreground">{gov}</option>
                      ))}
                    </select>
                    {errors.governorate && <p className="text-xs text-destructive">{errors.governorate.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">الكمية *</label>
                    <Input type="number" min="1" max="10" {...register("quantity")} error={!!errors.quantity} />
                    {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">العنوان بالتفصيل *</label>
                  <Textarea {...register("address")} error={!!errors.address} placeholder="اسم الشارع، رقم العمارة، رقم الشقة..." />
                  {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">رابط أو اسم صفحة الفيسبوك (اختياري)</label>
                  <Input {...register("facebookPage")} dir="ltr" className="text-left" placeholder="https://facebook.com/..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ملاحظات (اختياري)</label>
                  <Textarea {...register("notes")} placeholder="أي ملاحظات إضافية بخصوص الطلب..." />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg mt-8 h-16 shadow-primary/30 shadow-xl" isLoading={isPending}>
                  تأكيد الطلب الآن
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="bg-black/40 border border-primary/20 rounded-3xl p-6 sticky top-32 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">ملخص الطلب</h3>
              
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  <img src={product.images[0] || ""} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold line-clamp-2">{product.nameAr || product.name}</h4>
                  <p className="text-primary mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>السعر</span>
                  <span>{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الكمية</span>
                  <span>{watchQty}</span>
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

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                الدفع عند الاستلام متاح لمعظم المحافظات
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
