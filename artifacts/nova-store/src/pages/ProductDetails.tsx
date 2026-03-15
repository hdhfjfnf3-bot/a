import { useParams, Link } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function ProductDetails() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { data: product, isLoading, error } = useGetProduct(id);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-destructive mb-4">المنتج غير موجود</h1>
        <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على المنتج المطلوب.</p>
        <Link href="/products">
          <Button>العودة للمنتجات</Button>
        </Link>
      </div>
    );
  }

  const isSoldOut = product.stock <= 0;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          العودة للمنتجات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-card rounded-3xl border border-white/5 p-8 flex items-center justify-center shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={product.images[activeImage] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"} 
                alt={product.nameAr || product.name}
                className="w-full h-full object-contain drop-shadow-2xl z-10"
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl border-2 p-2 bg-card flex items-center justify-center transition-all ${
                      activeImage === i ? "border-primary opacity-100 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              {product.badge && (
                <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-primary/30">
                  {product.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {product.nameAr || product.name}
              </h1>
              <p className="text-primary font-medium text-lg">
                {product.categoryNameAr || product.categoryName || 'متنوع'}
              </p>
            </div>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
              <span className="text-4xl font-bold text-gradient-gold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-10 text-muted-foreground leading-relaxed">
              <p>{product.descriptionAr || product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">شحن لجميع المحافظات</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">ضمان الجودة</span>
              </div>
            </div>

            {/* Action */}
            <div className="mt-auto pt-8">
              {isSoldOut ? (
                <Button size="lg" disabled className="w-full lg:w-auto min-w-[250px] opacity-70">
                  نفذت الكمية
                </Button>
              ) : (
                <Link href={`/order/${product.id}`}>
                  <Button size="lg" className="w-full lg:w-auto min-w-[250px] text-lg shadow-xl shadow-primary/30 hover:-translate-y-1">
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    اشتري الآن
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
