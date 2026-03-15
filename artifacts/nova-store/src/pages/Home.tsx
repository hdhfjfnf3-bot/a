import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ShieldCheck, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useGetProducts } from "@workspace/api-client-react";
import { useEffect, useRef } from "react";

function LuxuryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Particles
    const PARTICLE_COUNT = 120;
    type Particle = {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number; life: number; maxLife: number;
    };
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      size: Math.random() * 3 + 0.5,
      opacity: Math.random(),
      hue: 40 + Math.random() * 20,
      life: Math.random() * 300,
      maxLife: 200 + Math.random() * 200,
    }));

    // Light beams
    const BEAMS = 5;
    type Beam = { x: number; angle: number; width: number; speed: number; opacity: number; };
    const beams: Beam[] = Array.from({ length: BEAMS }, (_, i) => ({
      x: (w / (BEAMS + 1)) * (i + 1),
      angle: -0.3 + Math.random() * 0.6,
      width: 60 + Math.random() * 100,
      speed: 0.0003 + Math.random() * 0.0003,
      opacity: 0.03 + Math.random() * 0.04,
    }));

    let t = 0;

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      // Deep dark background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.8);
      bgGrad.addColorStop(0, "#0d0a06");
      bgGrad.addColorStop(0.5, "#080603");
      bgGrad.addColorStop(1, "#030200");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Ambient gold glow center
      const centerGlow = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, w * 0.4);
      centerGlow.addColorStop(0, "rgba(212,175,55,0.07)");
      centerGlow.addColorStop(0.5, "rgba(180,140,20,0.03)");
      centerGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      // Light beams
      beams.forEach((beam) => {
        const pulse = 0.6 + 0.4 * Math.sin(t * beam.speed * 200);
        ctx.save();
        ctx.translate(beam.x + Math.sin(t * beam.speed * 40) * 80, 0);
        ctx.rotate(beam.angle + Math.sin(t * beam.speed * 20) * 0.05);
        const beamGrad = ctx.createLinearGradient(0, 0, 0, h);
        beamGrad.addColorStop(0, `rgba(212,175,55,0)`);
        beamGrad.addColorStop(0.2, `rgba(212,175,55,${beam.opacity * pulse})`);
        beamGrad.addColorStop(0.7, `rgba(212,175,55,${beam.opacity * pulse * 0.5})`);
        beamGrad.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.fillStyle = beamGrad;
        ctx.fillRect(-beam.width / 2, 0, beam.width, h);
        ctx.restore();
      });

      // Particles
      particles.forEach((p) => {
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = -Math.random() * 0.6 - 0.2;
          p.life = 0;
          p.maxLife = 200 + Math.random() * 200;
          p.size = Math.random() * 3 + 0.5;
          p.hue = 40 + Math.random() * 20;
        }
        p.x += p.vx + Math.sin(t * 0.005 + p.y * 0.01) * 0.15;
        p.y += p.vy;
        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.2
          ? lifeRatio * 5
          : lifeRatio > 0.8
          ? (1 - lifeRatio) * 5
          : 1;

        // Glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grd.addColorStop(0, `hsla(${p.hue},80%,65%,${alpha * 0.8})`);
        grd.addColorStop(1, `hsla(${p.hue},80%,55%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,80%,${alpha})`;
        ctx.fill();
      });

      // Horizontal shimmer lines
      for (let i = 0; i < 3; i++) {
        const lineY = ((h * (i + 1)) / 4 + Math.sin(t * 0.002 + i) * 30) % h;
        const lineAlpha = 0.03 + 0.02 * Math.sin(t * 0.01 + i * 2);
        const lineGrad = ctx.createLinearGradient(0, lineY, w, lineY);
        lineGrad.addColorStop(0, "rgba(212,175,55,0)");
        lineGrad.addColorStop(0.3, `rgba(212,175,55,${lineAlpha})`);
        lineGrad.addColorStop(0.7, `rgba(212,175,55,${lineAlpha})`);
        lineGrad.addColorStop(1, "rgba(212,175,55,0)");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(w, lineY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

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
        {/* Animated Canvas Background */}
        <LuxuryCanvas />

        {/* Overlay gradient to blend into page */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        </div>

        <motion.div 
          style={{ y: y1, opacity }}
          className="container relative z-[10] mx-auto px-4 text-center mt-20"
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
