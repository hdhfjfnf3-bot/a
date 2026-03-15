import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ShieldCheck, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useGetProducts } from "@workspace/api-client-react";

export function Home() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const { data: products, isLoading } = useGetProducts({ featured: true });

  const features = [
    { icon: Truck, title: "شحن سريع", desc: "توصيل لجميع المحافظات في أسرع وقت" },
    { icon: ShieldCheck, title: "ضمان الجودة", desc: "منتجات أصلية ومضمونة 100%" },
    { icon: Clock, title: "دعم على مدار الساعة", desc: "فريق خدمة عملاء جاهز لمساعدتك" },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/nova-hero.png`}
            alt="Nova Luxury Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        <motion.div 
          style={{ y: y1, opacity }}
          className="container relative z-10 mx-auto px-4 text-center mt-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/nova-logo.png`} 
              alt="NOVA" 
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            اكتشف <span className="text-gradient-gold font-luxury">الرفاهية</span> في كل تفصيلة
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            تسوق أحدث المنتجات الحصرية المختارة بعناية لتناسب ذوقك الرفيع.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/products">
              <Button size="lg" className="rounded-full text-lg px-12 group">
                تسوق التشكيلة الآن
                <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-2 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES STRIP */}
      <section className="border-y border-white/5 bg-white/5 backdrop-blur-md relative z-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center px-6 py-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient-gold">تشكيلة</span> مميزة
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg">
                اكتشف أكثر المنتجات مبيعاً والمفضلة لدى عملائنا
              </p>
            </motion.div>
            
            <Link href="/products">
              <Button variant="outline" className="gap-2 rounded-full">
                عرض الكل <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products?.slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* PROMO BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-panel-gold rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                ارتقِ بأسلوب حياتك مع مجموعتنا الحصرية
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl">
                خصم يصل إلى 30% على منتجات مختارة لفترة محدودة. تسوق الآن قبل نفاذ الكمية.
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  استفد من العرض
                </Button>
              </Link>
            </div>
            <div className="flex-1 w-full flex justify-center">
              {/* elegant watch or perfume generic unsplash image */}
              <img 
                src="https://pixabay.com/get/gb641aca89a2c04d8124341f9e63616eedce80aff9e3dd74503e9858c6d691080fa9a89cd049def147cce44fb2e1f517054f441681f1b68f104510d04f18a6143_1280.jpg" 
                alt="Promo" 
                className="w-full max-w-md rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border border-white/20"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
