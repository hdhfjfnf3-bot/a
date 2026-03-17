import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { formatPrice } from "@/lib/utils";
import { getProductStats } from "@/lib/reviews";
import type { Product } from "@workspace/api-client-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isSoldOut = product.stock <= 0;
  const stats = getProductStats(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative flex flex-col bg-card rounded-xl md:rounded-2xl border border-white/5 overflow-hidden shadow-xl hover:shadow-primary/20 transition-shadow duration-500 h-full cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
          {product.badge && (
            <span className="bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg">
              {product.badge}
            </span>
          )}
          {isSoldOut && (
            <span className="bg-destructive text-destructive-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg">
              نفذت
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-white/5 p-2 md:p-4 flex items-center justify-center">
          <motion.img
            style={{ transformStyle: "preserve-3d", translateZ: "50px" }}
            src={product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
            alt={product.nameAr || product.name}
            className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <Button
              size="sm"
              className="gap-1 text-xs md:text-sm md:gap-2 scale-90 group-hover:scale-100 transition-transform duration-300"
              onClick={(e) => {
                e.stopPropagation();
                if (!isSoldOut) setLocation(`/order/${product.id}`);
              }}
              disabled={isSoldOut}
            >
              <ShoppingCart className="w-3 h-3 md:w-5 md:h-5" />
              اشتري
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 md:p-5 flex flex-col flex-grow">
          <Link href={`/products/${product.id}`} className="block mt-auto">
            <h3 className="text-xs md:text-lg font-bold text-foreground line-clamp-2 hover:text-primary transition-colors mb-1 md:mb-2">
              {product.nameAr || product.name}
            </h3>
          </Link>
          
          <div className="flex items-end justify-between mt-2 md:mt-4">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-[10px] md:text-sm text-muted-foreground line-through mb-0.5">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <p className="text-sm md:text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              {/* النجوم */}
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => {
                  const full = i <= Math.floor(stats.rating);
                  const half = !full && i === Math.ceil(stats.rating) && stats.rating % 1 !== 0;
                  return (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 ${
                        full ? 'text-amber-400 fill-amber-400' :
                        half ? 'text-amber-400 fill-amber-400/50' :
                        'text-gray-600'
                      }`}
                    />
                  );
                })}
                <span className="text-[9px] md:text-xs text-muted-foreground mr-0.5">{stats.rating.toFixed(1)}</span>
              </div>
              {/* المبيعات */}
              <p className="text-[9px] md:text-xs text-muted-foreground">{stats.salesCount}+ مبيعة</p>
            </div>
          </div>
        </div>
        
        {/* Bottom animated border */}
        <div className="h-1 w-full bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </motion.div>
    </motion.div>
  );
}
