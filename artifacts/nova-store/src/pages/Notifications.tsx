import { useGetMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

const STATUS_INFO: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:   { label: "قيد الانتظار",  icon: Clock,         color: "text-amber-400",  bg: "bg-amber-500/10"  },
  confirmed: { label: "تم التأكيد",    icon: Package,       color: "text-blue-400",   bg: "bg-blue-500/10"   },
  shipped:   { label: "جاري الشحن",    icon: Truck,         color: "text-purple-400", bg: "bg-purple-500/10" },
  delivered: { label: "تم التوصيل ✅", icon: CheckCircle,   color: "text-green-400",  bg: "bg-green-500/10"  },
  cancelled: { label: "ملغي",          icon: XCircle,       color: "text-red-400",    bg: "bg-red-500/10"    },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `منذ ${days} ${days === 1 ? "يوم" : "أيام"}`;
  if (hours > 0) return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
  if (mins > 0) return `منذ ${mins} دقيقة`;
  return "الآن";
}

export function Notifications() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useGetMe({ query: { retry: false, queryKey: ["/api/auth/me"] } });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !isUserLoading) {
      setLocation("/login?redirect=/notifications");
      return;
    }
    if (!user) return;

    // Fetch user's own orders by phone
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?phone=${user.phone}`);
        if (res.ok) {
          const data = await res.json();
          const arr = Array.isArray(data) ? data : (data?.data ?? []);
          // Filter only orders belonging to this user
          setOrders(arr.filter((o: any) => o.phone === user.phone));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isUserLoading]);

  if (isUserLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">الإشعارات</h1>
              <p className="text-sm text-muted-foreground">تحديثات حالة طلباتك</p>
            </div>
          </div>

          {/* Orders / Notifications */}
          {orders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">لا توجد إشعارات بعد</p>
              <p className="text-sm mt-2">ستظهر هنا تحديثات حالة طلباتك</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any, i: number) => {
                const info = STATUS_INFO[order.status] || STATUS_INFO["pending"];
                const Icon = info.icon;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 hover:border-primary/40 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-sm">طلب #{order.id}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${info.bg} ${info.color} border-current/30 whitespace-nowrap`}>
                          {info.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.productNameAr || order.productName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(order.updatedAt || order.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
