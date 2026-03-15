import { useState } from "react";
import { useGetMe, useGetOrders, useGetProducts, useUpdateOrderStatus, UpdateOrderStatusRequestStatus } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, TrendingUp, Users, Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export function Admin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { retry: false } });
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  const { data: orders, isLoading: isOrdersLoading } = useGetOrders({ query: { enabled: user?.role === 'admin' } });
  const { data: products, isLoading: isProductsLoading } = useGetProducts(undefined, { query: { enabled: user?.role === 'admin' } });

  const { mutate: updateStatus } = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/orders"] })
    }
  });

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>;

  if (!user || user.role !== 'admin') {
    // Redirect using useEffect to avoid setState-during-render warning
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
    return null;
  }

  const statCards = [
    { title: "إجمالي الطلبات", value: orders?.length || 0, icon: ShoppingBag, color: "text-blue-500" },
    { title: "الطلبات المعلقة", value: orders?.filter(o => o.status === 'pending').length || 0, icon: RefreshCw, color: "text-amber-500" },
    { title: "إجمالي المنتجات", value: products?.length || 0, icon: Package, color: "text-purple-500" },
    { title: "المبيعات", value: formatPrice(orders?.reduce((acc, o) => acc + (o.status === 'delivered' ? o.totalPrice : 0), 0) || 0), icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">لوحة تحكم الإدارة</h1>
          <p className="text-muted-foreground">أهلاً بك، {user.fullName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-semibold transition-colors relative ${activeTab === 'orders' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            الطلبات
            {activeTab === 'orders' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-4 font-semibold transition-colors relative ${activeTab === 'products' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            المنتجات
            {activeTab === 'products' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              {isOrdersLoading ? (
                <div className="p-12 text-center">جاري التحميل...</div>
              ) : (
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                    <tr>
                      <th className="px-6 py-4">رقم الطلب</th>
                      <th className="px-6 py-4">العميل</th>
                      <th className="px-6 py-4">الهاتف</th>
                      <th className="px-6 py-4">المنتج</th>
                      <th className="px-6 py-4">الإجمالي</th>
                      <th className="px-6 py-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders?.map(order => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono">#{order.id}</td>
                        <td className="px-6 py-4 font-bold">{order.fullName}</td>
                        <td className="px-6 py-4 font-mono text-muted-foreground" dir="ltr">{order.phone}</td>
                        <td className="px-6 py-4">{order.productNameAr || order.productName} ({order.quantity}x)</td>
                        <td className="px-6 py-4 font-bold text-primary">{formatPrice(order.totalPrice)}</td>
                        <td className="px-6 py-4">
                          <select 
                            className="bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary"
                            value={order.status}
                            onChange={(e) => updateStatus({ id: order.id, data: { status: e.target.value as UpdateOrderStatusRequestStatus } })}
                          >
                            <option value="pending">قيد الانتظار</option>
                            <option value="confirmed">تم التأكيد</option>
                            <option value="shipped">تم الشحن</option>
                            <option value="delivered">تم التوصيل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">لا توجد طلبات بعد</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">قائمة المنتجات</h2>
                {/* Normally we'd open a Dialog for Create Product here */}
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">إضافة منتج جديد (قريباً)</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map(product => (
                  <div key={product.id} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                    <img src={product.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover bg-black" />
                    <div>
                      <h4 className="font-bold mb-1">{product.nameAr || product.name}</h4>
                      <p className="text-primary font-bold text-sm mb-2">{formatPrice(product.price)}</p>
                      <div className="text-xs text-muted-foreground flex gap-3">
                        <span>المخزون: {product.stock}</span>
                        {product.featured && <span className="text-amber-500">مميز ★</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
