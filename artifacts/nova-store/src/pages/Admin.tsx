import { useState } from "react";
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
  X, Check, AlertTriangle, Tag, ChevronDown, ChevronUp, MapPin, Phone, Facebook
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: initial?.name || "", nameAr: initial?.nameAr || "",
      description: initial?.description || "", descriptionAr: initial?.descriptionAr || "",
      price: initial?.price || 0, originalPrice: (initial as any)?.originalPrice || 0,
      images: Array.isArray((initial as any)?.images) ? (initial as any).images.join("\n") : ((initial as any)?.images || ""),
      categoryId: initial?.categoryId || 0, stock: initial?.stock || 0,
      featured: initial?.featured || false, badge: initial?.badge || "",
    }
  });
  const submit = (d: ProductFormData) => {
    onSave({
      ...d,
      price: Number(d.price),
      originalPrice: Number(d.originalPrice) || undefined,
      images: String(d.images).split("\n").map(s => s.trim()).filter(Boolean),
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
        <div className="space-y-1">
          <label className="text-sm font-medium">السعر (جنيه) *</label>
          <Input type="number" {...register("price", { required: true })} placeholder="0" dir="ltr" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">السعر قبل الخصم</label>
          <Input type="number" {...register("originalPrice")} placeholder="0" dir="ltr" />
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
      <div className="space-y-1">
        <label className="text-sm font-medium">روابط الصور (رابط في كل سطر) *</label>
        <Textarea {...register("images", { required: true })} placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"} rows={3} dir="ltr" className="font-mono text-xs" />
        <p className="text-xs text-muted-foreground">حط كل رابط في سطر منفصل</p>
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
  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { retry: false } });
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  const [productModal, setProductModal] = useState<null | 'add' | { id: number }>(null);
  const [catModal, setCatModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [orderSearch, setOrderSearch] = useState("");

  const { data: orders, isLoading: isOrdersLoading } = useGetOrders({ query: { enabled: user?.role === 'admin' } });
  const { data: products, isLoading: isProductsLoading } = useGetProducts(undefined, { query: { enabled: user?.role === 'admin' } });
  const { data: categories } = useGetCategories({ query: { enabled: true } });

  const { mutate: updateStatus } = useUpdateOrderStatus({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/orders"] }) }
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

  const editProduct = products?.find(p => typeof productModal === 'object' && p.id === productModal.id);

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
  ] as const;

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
                {products?.map(p => (
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
              {categories?.map(c => (
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
