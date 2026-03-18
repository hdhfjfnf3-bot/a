import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ShieldCheck, Truck, Clock, Star, Zap, Crown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useGetProducts } from "@workspace/api-client-react";
import { useReveal } from "@/components/RevealSystem";
import { useRef, useState, useCallback } from "react";

/* ─── خلفية فيديو متتالية ─── */
// video_bg1.mp4  ← يشتغل أولاً
// video_bg2.mp4  ← يُحمَّل في الخلفية، ثم يُشغَّل بعد انتهاء الأول فقط إذا جهز
const BG_VIDEOS = ["video_bg1.mp4", "video_bg2.mp4"];

function VideoBackground({ onVideoChange }: { onVideoChange: (idx: number) => void }) {
  const [idx, setIdx] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const nextReadyRef = useRef(false); // هل الفيديو الثاني جاهز؟
  const preloadStarted = useRef(false);

  // ابدأ تحميل الفيديو الثاني بعد 1.5 ثانية فقط (يعطي الأول وقت يبدأ)
  React.useEffect(() => {
    if (preloadStarted.current) return;
    preloadStarted.current = true;
    const t = setTimeout(() => {
      const v2 = videoRefs.current[1];
      if (!v2) return;
      v2.preload = "auto";
      v2.load();
      // عند جهوز الفيديو الثاني للتشغيل — علّم نفسك
      const onReady = () => { nextReadyRef.current = true; };
      v2.addEventListener("canplaythrough", onReady, { once: true });
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // عند انتهاء الفيديو الحالي — انتقل للتالي أو كرر الأول إن لم يجهز بعد
  const onEnded = useCallback(() => {
    const v1 = videoRefs.current[0];
    const v2 = videoRefs.current[1];

    if (idx === 0) {
      // انتهى الفيديو الأول — هل الثاني جاهز؟
      if (nextReadyRef.current && v2) {
        v2.currentTime = 0;
        v2.play().catch(() => {});
        setIdx(1);
      } else {
        // الثاني لم يتحمل بعد — كرر الأول بدون انقطاع
        if (v1) {
          v1.currentTime = 0;
          v1.play().catch(() => {});
        }
      }
    } else {
      // انتهى الفيديو الثاني — ارجع للأول ثم الثاني من جديد (loop دائمي)
      if (v1) {
        v1.currentTime = 0;
        v1.play().catch(() => {});
      }
      setIdx(0);
    }
  }, [idx]);

  // عند تبديل idx — أوقف الآخر وشغّل الصحيح
  React.useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) {
        if (v.paused) v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
    onVideoChange(idx);
  }, [idx, onVideoChange]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050302]" style={{ zIndex: 0 }}>
      {BG_VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={el => { videoRefs.current[i] = el; }}
          src={`${import.meta.env.BASE_URL}${src}`}
          muted
          playsInline
          autoPlay={i === 0}
          preload={i === 0 ? "auto" : "none"}
          onEnded={i === idx ? onEnded : undefined}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === idx ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
      {/* تعتيم فاخر */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,2,8,0.3) 0%, rgba(4,2,8,0.1) 45%, rgba(4,2,8,0.7) 100%)",
          zIndex: 11,
        }}
      />
      {/* توهج ذهبي */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%)",
          zIndex: 12,
        }}
      />
    </div>
  );
}


/* ─── بطاقة ميزة ─── */
function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group flex flex-col items-center text-center px-8 py-10 rounded-3xl border border-white/5 bg-white/3 backdrop-blur-sm overflow-hidden cursor-default"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-9 h-9" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 relative z-10">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{desc}</p>
    </motion.div>
  );
}

/* ─── شريط الإحصائيات ─── */
function StatsBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl md:text-3xl font-extrabold text-gradient-gold font-luxury">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/* ─── الصفحة الرئيسية ─── */
export function Home() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const { revealed } = useReveal();
  const { data: products, isLoading } = useGetProducts({ featured: true });

  // تتبع الفيديو الحالي لإظهار/إخفاء اللوجو
  const [bgVideoIdx, setBgVideoIdx] = useState(0);

  const features = [
    { icon: Truck, title: "شحن سريع لكل مصر", desc: "توصيل لجميع المحافظات في أسرع وقت ممكن" },
    { icon: ShieldCheck, title: "ضمان الجودة 100%", desc: "منتجات أصلية ومضمونة أو استرداد كامل" },
    { icon: Clock, title: "دعم 24/7", desc: "فريق خدمة عملاء جاهز لمساعدتك في أي وقت" },
    { icon: Crown, title: "منتجات حصرية فاخرة", desc: "مختارة بعناية فائقة لتناسب ذوقك الرفيع" },
  ];

  return (
    <div className="min-h-screen bg-[#050302]">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <VideoBackground onVideoChange={setBgVideoIdx} />

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#050302] via-[#050302]/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#050302]/70 to-transparent" />
        </div>


        <motion.div style={{ y: y1, opacity }} className="container relative z-[10] mx-auto px-4 text-center">

          {/* Crown icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={revealed ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-8"
          >
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-primary text-sm font-medium">متجر نوفا — التسوق الفاخر</span>
            <Star className="w-4 h-4 text-primary fill-primary" />
          </motion.div>

          {/* Logo */}
          {/* يختفي اللوجو في الفيديو الأول (0) ويظهر في الثاني (1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              revealed && bgVideoIdx === 1
                ? { opacity: 1, scale: 1, display: "flex" }
                : { opacity: 0, scale: 0.85, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-8 flex justify-center"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/nova-logo-real.jpg`}
              alt="NOVA"
              className="w-44 md:w-64 object-contain drop-shadow-[0_0_60px_rgba(212,175,55,0.7)]"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.28 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-[1.15]"
          >
            اكتشف{" "}
            <span className="text-gradient-gold font-luxury relative">
              الرفاهية
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
            </span>{" "}
            في كل تفصيلة
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            تسوق أحدث المنتجات الحصرية المختارة بعناية — جودة استثنائية بأسعار لا تُقاوَم
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.56 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/products">
              <Button size="lg" className="rounded-full text-base md:text-lg px-10 h-14 shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-all duration-300 group">
                تسوق التشكيلة الآن
                <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="rounded-full text-base md:text-lg px-10 h-14 border-white/15 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                اكتشف المزيد
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-10 md:gap-16 border-t border-white/5 pt-10"
          >
            <StatsBadge value="+500" label="عميل سعيد" />
            <div className="h-8 w-px bg-white/10" />
            <StatsBadge value="+50" label="منتج مميز" />
            <div className="h-8 w-px bg-white/10" />
            <StatsBadge value="100%" label="ضمان الجودة" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/30"
        >
          <span className="text-xs tracking-widest uppercase">اسحب للأسفل</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-24 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm">لماذا نوفا؟</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              تجربة تسوق{" "}
              <span className="text-gradient-gold font-luxury">لا مثيل لها</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ DIVIDER ══════════════ */}
      <div className="relative z-20 my-4">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-primary/60 blur-sm" />
      </div>

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <section className="py-24 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-primary text-sm">الأكثر مبيعاً</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                <span className="text-gradient-gold font-luxury">تشكيلتنا</span> المميزة
              </h2>
              <p className="text-muted-foreground mt-3 text-lg max-w-md">
                اكتشف المنتجات المفضلة لدى آلاف العملاء
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <Link href="/products">
                <Button variant="outline" className="gap-2 rounded-full border-white/15 hover:border-primary/50 hover:bg-primary/5 px-6 h-12">
                  عرض كل المنتجات <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                <Crown className="absolute inset-0 m-auto w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">جاري تحميل أفضل المنتجات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {(Array.isArray(products) ? products : (products as any)?.data || [])
                .slice(0, 8)
                .map((product: any, i: number) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ PROMO BANNER ══════════════ */}
      <section className="py-20 relative z-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] overflow-hidden border border-primary/20 bg-gradient-to-br from-[#1a1100] via-[#120d04] to-[#0a0702] p-10 md:p-16 shadow-[0_0_80px_rgba(212,175,55,0.1)]"
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {/* Decorative corner gems */}
            <div className="absolute top-6 right-6 w-12 h-12 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1 text-center md:text-right">
                <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">عرض محدود الوقت</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                  ارتقِ بأسلوب حياتك{" "}
                  <span className="text-gradient-gold font-luxury block">مع مجموعتنا الحصرية</span>
                </h2>
                <p className="text-white/60 text-lg mb-8 max-w-lg">
                  خصم يصل إلى <span className="text-primary font-bold">30%</span> على منتجات مختارة لفترة محدودة. تسوق الآن قبل نفاذ الكمية.
                </p>
                <Link href="/products">
                  <Button
                    size="lg"
                    className="rounded-full px-12 h-14 text-lg bg-gradient-to-r from-primary to-amber-500 text-black font-bold hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all duration-300 group"
                  >
                    استفد من العرض الآن
                    <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Stats column */}
              <div className="flex-shrink-0 flex flex-col gap-5">
                {[
                  { value: "30%", label: "أقصى خصم" },
                  { value: "24h", label: "توصيل سريع" },
                  { value: "100%", label: "رضا مضمون" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl px-6 py-4"
                  >
                    <span className="text-2xl font-extrabold text-gradient-gold font-luxury">{s.value}</span>
                    <span className="text-white/60 text-sm">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOOTER STRIP ══════════════ */}
      <div className="relative z-20 py-8 border-t border-white/5">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-sm">
          <span>© 2026 NOVA Store — أحمد محرم. جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/201005209667"
              target="_blank" rel="noreferrer"
              className="hover:text-green-400 transition-colors flex items-center gap-1"
            >
              <span>📱</span> واتساب
            </a>
            <span className="text-white/10">|</span>
            <a
              href="https://www.facebook.com"
              target="_blank" rel="noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              📘 فيسبوك
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
