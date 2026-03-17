import { useState, useRef, useCallback } from "react";
import {
  useGetMe, useGetOrders, useGetProducts, useGetCategories,
  useUpdateOrderStatus, useCreateProduct, useUpdateProduct, useDeleteProduct, useCreateCategory,
  UpdateOrderStatusRequestStatus
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import {
  Package, ShoppingBag, TrendingUp, RefreshCw, Plus, Pencil, Trash2,
  X, Check, AlertTriangle, Tag, ChevronDown, ChevronUp, MapPin, Phone, Facebook,
  Upload, ImagePlus, Loader2, MessageCircle, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

/* ─── tiny modal ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

/* ─── product form ─── */
type ProductFormData = {
  name: string; nameAr: string; description: string; descriptionAr: string;
  price: number; originalPrice: number; images: string; categoryId: number;
  stock: number; featured: boolean; badge: string;
};

function ProductForm({ initial, onSave, onClose, categories }: {
  initial?: Partial<ProductFormData & { id: number }>;
  onSave: (d: any) => void;
  onClose: () => void;
  categories: any[];
}) {
  // الصور: نبدأ بالصور الموجودة إن كان تعديلاً
  const initImages: string[] = Array.isArray((initial as any)?.images)
    ? (initial as any).images
    : String((initial as any)?.images || "").split("\n").map((s: string) => s.trim()).filter(Boolean);

  const [uploadedImages, setUploadedImages] = useState<string[]>(initImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      }
      setUploadedImages(prev => [...prev, ...urls]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("فشل رفع الصورة، تأكد أن السيرفر شتغال");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const removeImage = (idx: number) =>
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));

  // حساب الخصم المبدئي
  const initOrigPrice = (initial as any)?.originalPrice ? Number((initial as any).originalPrice) : 0;
  const initPrice = initial?.price ? Number(initial.price) : 0;
  const initDiscount = initOrigPrice > 0 && initPrice > 0
    ? Math.round((1 - initPrice / initOrigPrice) * 100)
    : 0;

  const [origPrice, setOrigPrice] = useState(initOrigPrice);
  const [finalPrice, setFinalPrice] = useState(initPrice);
  const [discountPct, setDiscountPct] = useState(initDiscount);

  const handleOrigPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setOrigPrice(val);
    if (val > 0) {
      const d = initial?.id ? discountPct : 30; // 30% افتراضي للمنتج الجديد
      setDiscountPct(d);
      setFinalPrice(Math.round(val * (1 - d / 100)));
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let d = Number(e.target.value);
    if (d > 90) d = 90; // أقصى خصم 90%
    if (d < 0) d = 0;
    setDiscountPct(d);
    if (origPrice > 0) setFinalPrice(Math.round(origPrice * (1 - d / 100)));
  };

  const handleFinalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFinalPrice(val);
    if (origPrice > 0 && val > 0) {
      const d = Math.round((1 - val / origPrice) * 100);
      setDiscountPct(Math.min(Math.max(d, 0), 90));
    }
  };

  const { register, handleSubmit } = useForm<ProductFormData>({
    defaultValues: {
      name: initial?.name || "", nameAr: initial?.nameAr || "",
      description: initial?.description || "", descriptionAr: initial?.descriptionAr || "",
      price: initial?.price || 0, originalPrice: (initial as any)?.originalPrice || 0,
      categoryId: initial?.categoryId || 0, stock: initial?.stock || 0,
      featured: initial?.featured || false, badge: initial?.badge || "",
    }
  });

  const submit = (d: ProductFormData) => {
    if (uploadedImages.length === 0) {
      alert("يرجى رفع صورة واحدة على الأقل للمنتج");
      return;
    }
    // تطبيق الحد الأقصى للخصم 90%
    let fp = finalPrice > 0 ? finalPrice : Number(d.price);
    const op = origPrice > 0 ? origPrice : Number(d.originalPrice);
    if (op > 0 && fp < op * 0.1) {
      fp = Math.round(op * 0.1);
      alert("تم تعديل السعر: أقصى خصم مسموح 90%");
    }
    onSave({
      ...d,
      price: fp,
      originalPrice: op || undefined,
      images: uploadedImages,
      categoryId: Number(d.categoryId) || undefined,
      stock: Number(d.stock),
      featured: Boolean(d.featured),
    });
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">الاسم بالإنجليزية *</label>
          <Input {...register("name", { required: true })} placeholder="Product Name" dir="ltr" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">الاسم بالعربية *</label>
          <Input {...register("nameAr", { required: true })} placeholder="اسم المنتج" />
        </div>

        {/* حاسبة الخصم الذكية */}
        <div className="col-span-2 grid grid-cols-3 gap-3 bg-white/5 p-3 rounded-xl border border-amber-500/20">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">السعر الأصلي</label>
            <Input
              type="number"
              value={origPrice || ""}
              onChange={handleOrigPriceChange}
              placeholder="0"
              dir="ltr"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-primary">خصم % <span className="text-muted-foreground">(max 90)</span></label>
            <Input
              type="number"
              value={discountPct || ""}
              onChange={handleDiscountChange}
              placeholder="30"
              min={0}
              max={90}
              dir="ltr"
              className="h-9 border-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-green-400">السعر النهائي *</label>
            <Input
              type="number"
              value={finalPrice || ""}
              onChange={handleFinalPriceChange}
              placeholder="0"
              dir="ltr"
              className="h-9 border-green-500/30"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">المخزون *</label>
          <Input type="number" {...register("stock", { required: true })} placeholder="0" dir="ltr" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">القسم</label>
          <select {...register("categoryId")} className="w-full bg-input border border-border rounded-lg px-3 py-2 outline-none focus:border-primary">
            <option value={0}>-- بدون قسم --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">بادج (مثال: جديد، الأكثر مبيعاً)</label>
        <Input {...register("badge")} placeholder="الأكثر مبيعاً" />
      </div>
      {/* رفع الصور */}
      <div className="space-y-2">
        <label className="text-sm font-medium">صور المنتج *</label>

        {/* منطقة الرفع */}
        <div
          className="border-2 border-dashed border-amber-500/40 rounded-xl p-4 text-center cursor-pointer hover:border-amber-500/70 hover:bg-amber-500/5 transition-all"
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-amber-400 py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">جارِ الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 py-2">
              <ImagePlus className="w-8 h-8 text-amber-500/60" />
              <p className="text-sm text-muted-foreground">اضغط لرفع صورة أو أكثر</p>
              <p className="text-xs text-muted-foreground/60">JPG, PNG, WEBP حتى 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {/* معاينة الصور المرفوعة */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {uploadedImages.map((url, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border border-border">
                <img src={url} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 left-1 bg-red-500/80 hover:bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">وصف المنتج (عربي)</label>
        <Textarea {...register("descriptionAr")} placeholder="وصف المنتج بالتفصيل..." rows={2} />
      </div>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border">
        <input type="checkbox" id="featured" {...register("featured")} className="w-4 h-4 accent-amber-500" />
        <label htmlFor="featured" className="text-sm font-medium cursor-pointer">منتج مميز (يظهر في الصفحة الرئيسية)</label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          <Check className="w-4 h-4 ml-2" />
          {initial?.id ? "حفظ التعديلات" : "إضافة المنتج"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
      </div>
    </form>
  );
}

/* ─── order detail row ─── */
function OrderRow({ order, onStatusChange }: { order: any; onStatusChange: (id: number, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    shipped: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    delivered: "bg-green-500/10 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  const statusLabel: Record<string, string> = {
    pending: "قيد الانتظار", confirmed: "تم التأكيد",
    shipped: "جاري الشحن", delivered: "تم التوصيل", cancelled: "ملغي"
  };

  return (
    <>
      <tr className="hover:bg-white/5 transition-colors border-b border-border/50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-4 py-3 font-mono text-primary font-bold">#{order.id}</td>
        <td className="px-4 py-3">
          <div className="font-bold text-sm">{order.fullName}</div>
          <div className="text-xs text-muted-foreground" dir="ltr">{order.phone}</div>
        </td>
        <td className="px-4 py-3 text-sm">{order.productNameAr || order.productName}<span className="text-muted-foreground text-xs"> ×{order.quantity}</span></td>
        <td className="px-4 py-3 font-bold text-primary text-sm">{formatPrice(order.totalPrice)}</td>
        <td className="px-4 py-3">
          <span className={`inline-block text-xs px-2 py-1 rounded-full border ${statusColor[order.status] || ""}`}>
            {statusLabel[order.status] || order.status}
          </span>
        </td>
        <td className="px-4 py-3">
          <select
            className="bg-background border border-border rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
            value={order.status}
            onClick={e => e.stopPropagation()}
            onChange={e => onStatusChange(order.id, e.target.value)}
          >
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">تم التأكيد</option>
            <option value="shipped">جاري الشحن</option>
            <option value="delivered">تم التوصيل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
        <td className="px-4 py-3">{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</td>
      </tr>
      {expanded && (
        <tr className="bg-white/3">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">العنوان</div>
                  <div className="font-medium">{order.governorate} - {order.address}</div>
                </div>
              </div>
              {order.altPhone && (
                <div className="flex gap-2 items-start">
                  <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">الرقم البديل</div>
                    <div className="font-mono">{order.altPhone}</div>
                  </div>
                </div>
              )}
              {order.facebookPage && (
                <div className="flex gap-2 items-start">
                  <Facebook className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">صفحة فيسبوك</div>
                    <div>{order.facebookPage}</div>
                  </div>
                </div>
              )}
              {order.notes && (
                <div className="flex gap-2 items-start col-span-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">ملاحظات</div>
                    <div className="text-amber-200">{order.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ─── main admin page ─── */
export function Admin() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { retry: false, queryKey: ['/api/auth/me'] } });
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'chats'>('orders');
  const [productModal, setProductModal] = useState<null | 'add' | { id: number }>(null);
  const [catModal, setCatModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [messagesRaw, setMessagesRaw] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<{ phone: string, productId: number } | null>(null);
  const [adminReply, setAdminReply] = useState("");

  const { data: orders, isLoading: isOrdersLoading } = useGetOrders({ query: { enabled: user?.role === 'admin', queryKey: ['/api/orders'] } });
  const { data: productsRaw, isLoading: isProductsLoading } = useGetProducts(undefined, { query: { enabled: user?.role === 'admin', queryKey: ['/api/products'] } });
  const { data: categoriesRaw } = useGetCategories({ query: { enabled: true, queryKey: ['/api/categories'] } });
  const toArr = (d: any) => Array.isArray(d) ? d : (d?.data ?? []);
  const products = toArr(productsRaw);
  const categories = toArr(categoriesRaw);

  const fetchAdminMessages = useCallback(async () => {
    if (user?.role !== 'admin') return;
    try {
      const res = await fetch("/api/messages");
      if (res.ok) setMessagesRaw(await res.json());
    } catch (e) { console.error(e); }
  }, [user]);

  // Fetch messages initially and poll
  useEffect(() => {
    fetchAdminMessages();
    const intv = setInterval(fetchAdminMessages, 10000);
    return () => clearInterval(intv);
  }, [fetchAdminMessages]);

  const { mutate: updateStatus } = useUpdateOrderStatus({
    mutation: {
      onSuccess: async (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        // Auto delete chats inside API if marked as delivered
        if (variables.data.status === 'delivered') {
          const matchedOrder = orders?.find(o => o.id === variables.id);
          if (matchedOrder) {
             try {
               await fetch(`/api/messages/${matchedOrder.phone}/${matchedOrder.productId}`, { method: 'DELETE' });
               fetchAdminMessages();
             } catch(e) {}
          }
        }
      }
    }
  });
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); setProductModal(null); } }
  });
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); setProductModal(null); } }
  });
  const { mutate: deleteProduct } = useDeleteProduct({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); setDeleteConfirm(null); } }
  });
  const { mutate: createCategory, isPending: isCreatingCat } = useCreateCategory({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/categories"] }); setCatModal(false); } }
  });

  const catForm = useForm({ defaultValues: { name: "", nameAr: "", slug: "", icon: "" } });

  if (isUserLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  if (!user || user.role !== 'admin') {
    if (typeof window !== 'undefined') window.location.replace('/login');
    return null;
  }

  const filteredOrders = orders?.filter(o =>
    !orderSearch ||
    o.fullName.includes(orderSearch) ||
    o.phone.includes(orderSearch) ||
    (o.productNameAr || "").includes(orderSearch) ||
    o.governorate?.includes(orderSearch)
  ) || [];

  const editProduct = products?.find((p: any) => typeof productModal === 'object' && productModal !== null && productModal.id != null && p.id === productModal.id);

  const statCards = [
    { title: "إجمالي الطلبات", value: orders?.length || 0, icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "طلبات جديدة", value: orders?.filter(o => o.status === 'pending').length || 0, icon: RefreshCw, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "إجمالي المنتجات", value: products?.length || 0, icon: Package, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "المبيعات المحققة", value: formatPrice(orders?.filter(o => o.status === 'delivered').reduce((a, o) => a + o.totalPrice, 0) || 0), icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  const tabs = [
    { id: 'orders', label: `الطلبات (${orders?.length || 0})` },
    { id: 'products', label: `المنتجات (${products?.length || 0})` },
    { id: 'categories', label: `الأقسام (${categories?.length || 0})` },
    { id: 'chats', label: `المحادثات (${new Set(messagesRaw.map(m => m.user_phone + m.product_id)).size})` },
  ] as const;

  // Group messages for Chat tab
  const groupedChats = messagesRaw.reduce((acc, msg) => {
    const key = `${msg.user_phone}_${msg.product_id}`;
    if (!acc[key]) acc[key] = { phone: msg.user_phone, productId: msg.product_id, messages: [] };
    acc[key].messages.push(msg);
    return acc;
  }, {} as Record<string, any>);
  const chatList = Object.values(groupedChats);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-1">أهلاً، {user.fullName} 👋</p>
          </div>
          <div className="text-xs text-muted-foreground bg-white/5 px-3 py-2 rounded-lg border border-border">
            آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl border border-border bg-card shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-xs mb-2">{s.title}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}><s.icon className="w-5 h-5" /></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`pb-3 px-5 text-sm font-semibold transition-colors relative ${activeTab === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label}
              {activeTab === t.id && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <input
                className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="بحث باسم العميل أو الهاتف أو المنتج أو المحافظة..."
                value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">{filteredOrders.length} طلب</span>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-muted-foreground bg-white/5 border-b border-border">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">العميل</th>
                      <th className="px-4 py-3">المنتج</th>
                      <th className="px-4 py-3">الإجمالي</th>
                      <th className="px-4 py-3">الحالة</th>
                      <th className="px-4 py-3">تغيير الحالة</th>
                      <th className="px-4 py-3">التاريخ</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isOrdersLoading ? (
                      <tr><td colSpan={8} className="py-16 text-center text-muted-foreground">جاري التحميل...</td></tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr><td colSpan={8} className="py-16 text-center text-muted-foreground">
                        {orderSearch ? "لا توجد نتائج للبحث" : "لا توجد طلبات بعد"}
                      </td></tr>
                    ) : (
                      filteredOrders.map(order => (
                        <OrderRow key={order.id} order={order}
                          onStatusChange={(id, status) => updateStatus({ id, data: { status: status as UpdateOrderStatusRequestStatus } })}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-muted-foreground">{products?.length || 0} منتج مسجل</p>
              <Button onClick={() => setProductModal('add')} className="gap-2 rounded-full">
                <Plus className="w-4 h-4" /> إضافة منتج جديد
              </Button>
            </div>
            {isProductsLoading ? (
              <div className="py-20 text-center text-muted-foreground">جاري التحميل...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map((p: any) => (
                  <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="relative h-40 bg-black/30">
                      <img src={p.images?.[0]} alt={p.nameAr} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      {p.badge && <span className="absolute top-2 right-2 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
                      {p.featured && <span className="absolute top-2 left-2 bg-amber-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">⭐ مميز</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 line-clamp-1">{p.nameAr || p.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary font-bold">{formatPrice(p.price)}</span>
                        {p.originalPrice && <span className="text-muted-foreground text-xs line-through">{formatPrice(p.originalPrice)}</span>}
                        <span className="text-xs text-muted-foreground mr-auto">مخزون: {p.stock}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs h-8"
                          onClick={() => setProductModal({ id: p.id })}>
                          <Pencil className="w-3 h-3" /> تعديل
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => setDeleteConfirm(p.id)}>
                          <Trash2 className="w-3 h-3" /> حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-muted-foreground">{categories?.length || 0} قسم مسجل</p>
              <Button onClick={() => setCatModal(true)} className="gap-2 rounded-full">
                <Tag className="w-4 h-4" /> إضافة قسم جديد
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories?.map((c: any) => (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/50 transition-colors">
                  <div className="text-4xl mb-3">{c.icon || "📦"}</div>
                  <h3 className="font-bold">{c.nameAr}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.name}</p>
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{c.productCount || 0} منتج</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ── CHATS TAB ── */}
        {activeTab === 'chats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
            {/* Sidebar List */}
            <div className="md:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-border font-bold">المحادثات النشطة</div>
              <div className="flex-1 overflow-y-auto">
                {chatList.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">لا توجد محادثات</div>
                ) : (
                  chatList.map((chat: any) => {
                    const prodName = products?.find((p: any) => p.id === chat.productId)?.nameAr || `منتج #${chat.productId}`;
                    const isActive = activeChat?.phone === chat.phone && activeChat?.productId === chat.productId;
                    const lastMsg = chat.messages[chat.messages.length - 1];
                    
                    return (
                      <div key={`${chat.phone}_${chat.productId}`}
                        className={`relative border-b border-border/50 ${isActive ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
                      >
                        <button
                          onClick={() => setActiveChat({ phone: chat.phone, productId: chat.productId })}
                          className="w-full text-right p-4 hover:bg-white/5 transition-colors block pr-12"
                        >
                          <div className="font-bold text-sm mb-1">{prodName}</div>
                          <div className="text-xs text-muted-foreground font-mono" dir="ltr">{chat.phone}</div>
                          <div className="mt-2 text-xs text-muted-foreground truncate">{lastMsg?.content}</div>
                        </button>
                        {/* Delete button */}
                        <button
                          title="حذف المحادثة"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!confirm(`حذف محادثة ${chat.phone}?`)) return;
                            await fetch(`/api/messages/${chat.phone}/${chat.productId}`, { method: 'DELETE' });
                            if (activeChat?.phone === chat.phone && activeChat?.productId === chat.productId) {
                              setActiveChat(null);
                            }
                            fetchAdminMessages();
                          }}
                          className="absolute top-3 left-3 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Chat View */}
            <div className="md:col-span-2 bg-card border border-border rounded-2xl flex flex-col h-full overflow-hidden">
              {activeChat ? (() => {
                const chatData = groupedChats[`${activeChat.phone}_${activeChat.productId}`] || { messages: [] };
                const prodName = products?.find((p: any) => p.id === activeChat.productId)?.nameAr || `منتج #${activeChat.productId}`;
                return (
                  <>
                    <div className="p-4 border-b border-border flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{prodName}</div>
                        <div className="text-xs text-muted-foreground font-mono" dir="ltr">{activeChat.phone}</div>
                      </div>
                      {/* Delete entire conversation */}
                      <button
                        title="حذف المحادثة نهائياً"
                        onClick={async () => {
                          if (!confirm(`حذف كل محادثة ${activeChat.phone}?`)) return;
                          await fetch(`/api/messages/${activeChat.phone}/${activeChat.productId}`, { method: 'DELETE' });
                          setActiveChat(null);
                          fetchAdminMessages();
                        }}
                        className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1.5 text-xs font-medium"
                      >
                        <Trash2 className="w-4 h-4" /> حذف
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30">
                      {chatData.messages.map((msg: any) => (
                        <div key={msg.id} className={`max-w-[70%] rounded-2xl p-3 text-sm ${msg.sender === "admin" ? "bg-primary text-primary-foreground self-start rounded-tr-sm" : "bg-muted text-foreground self-end rounded-tl-sm mx-auto mr-0 md:mr-auto md:ml-0"}`}>
                          <p>{msg.content}</p>
                          <span className="text-[10px] opacity-50 mt-1 block">{new Date(msg.created_at).toLocaleTimeString('ar-EG')}</span>
                        </div>
                      ))}
                      {!chatData.messages.length && <div className="text-center text-muted-foreground mt-10">لا توجد رسائل</div>}
                    </div>
                    
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!adminReply.trim()) return;
                        try {
                          await fetch("/api/messages", {
                            method: "POST", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userPhone: activeChat.phone, productId: activeChat.productId, sender: "admin", content: adminReply })
                          });
                          setAdminReply("");
                          fetchAdminMessages();
                        } catch(err) {} 
                      }}
                      className="p-3 border-t border-border bg-card flex gap-2"
                    >
                      <Input value={adminReply} onChange={e => setAdminReply(e.target.value)} placeholder="اكتب ردك هنا..." className="flex-1 bg-background" />
                      <Button type="submit" disabled={!adminReply.trim()}><Send className="w-4 h-4 rtl:-scale-x-100" /></Button>
                    </form>
                  </>
                );
              })() : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <MessageCircle className="w-16 h-16 opacity-20 mb-4" />
                  <p>اختر محادثة للبدء في الرد</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {/* Add product modal */}
        {productModal === 'add' && (
          <Modal title="إضافة منتج جديد" onClose={() => setProductModal(null)}>
            <ProductForm categories={categories || []}
              onSave={(d) => createProduct({ data: d })}
              onClose={() => setProductModal(null)} />
          </Modal>
        )}

        {/* Edit product modal */}
        {typeof productModal === 'object' && editProduct && (
          <Modal title="تعديل المنتج" onClose={() => setProductModal(null)}>
            <ProductForm
              initial={{ ...editProduct, images: editProduct.images as any, price: Number(editProduct.price), originalPrice: editProduct.originalPrice ? Number(editProduct.originalPrice) : 0 }}
              categories={categories || []}
              onSave={(d) => updateProduct({ id: editProduct.id, data: d })}
              onClose={() => setProductModal(null)} />
          </Modal>
        )}

        {/* Delete confirm modal */}
        {deleteConfirm !== null && (
          <Modal title="تأكيد الحذف" onClose={() => setDeleteConfirm(null)}>
            <div className="text-center py-4">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-bold mb-2">هل أنت متأكد؟</p>
              <p className="text-muted-foreground mb-6 text-sm">سيتم حذف المنتج نهائياً ولا يمكن التراجع</p>
              <div className="flex gap-3">
                <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
                  onClick={() => deleteProduct({ id: deleteConfirm })}>
                  نعم، احذف
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>إلغاء</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add category modal */}
        {catModal && (
          <Modal title="إضافة قسم جديد" onClose={() => setCatModal(false)}>
            <form onSubmit={catForm.handleSubmit(d => createCategory({ data: d }))} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">الاسم بالعربية *</label>
                <Input {...catForm.register("nameAr", { required: true })} placeholder="ملابس" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">الاسم بالإنجليزية *</label>
                <Input {...catForm.register("name", { required: true })} placeholder="Clothing" dir="ltr" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">الـ Slug (للرابط) *</label>
                <Input {...catForm.register("slug", { required: true })} placeholder="clothing" dir="ltr" className="font-mono" />
                <p className="text-xs text-muted-foreground">حروف إنجليزية صغيرة وشرطات فقط</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">أيقونة (إيموجي)</label>
                <Input {...catForm.register("icon")} placeholder="👗" className="text-xl text-center" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={isCreatingCat}>
                  <Plus className="w-4 h-4 ml-2" /> إضافة القسم
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setCatModal(false)}>إلغاء</Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
