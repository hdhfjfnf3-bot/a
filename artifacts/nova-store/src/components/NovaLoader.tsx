import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NovaLoader — مضمون بدون شاشة سوداء إطلاقاً:
 * • يعرض شعار نبضي خافت فوراً لملء الفراغ أثناء التحميل
 * • بمجرد تحميل إطارات الفيديو، يظهر بانتقال ناعم
 * • يحمّل الفيديو بـ `preload=auto` للسرعة
 */
export function NovaLoader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"loading" | "fade" | "out">("loading");

  const finish = () => {
    if (phase !== "loading") return;
    setPhase("fade");
    // نقل السيطرة للموقع بعد اكتمال الـ fade  
    setTimeout(() => {
      setPhase("out");
      setTimeout(onDone, 100);
    }, 800);
  };

  useEffect(() => {
    // timeout احتياطي للنهاية لضمان عدم بقاء اللودر للأبد: 6 ثواني كحد أقصى (تم تقليله من 8 لسرعة التجربة)
    const safetyTimer = setTimeout(finish, 6000);

    return () => {
      clearTimeout(safetyTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "out" && (
        <motion.div
          key="loader"
          // أضفنا خلفية بلون داكن غني كاحتياطي لتفادي السواد التام
          className="fixed inset-0 z-[9999] bg-[#050302] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 
            خلفية اللوجو تظهر فوراً أثناء انتظار الفيديو 
            لكي لا يرى المستخدم شاشة سوداء أبداً
          */}
          <div
            key="fallback-logo"
            className="absolute inset-0 flex items-center justify-center z-0"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/nova-logo-real.jpg`}
              alt="NOVA Loading"
              className="w-48 opacity-40 animate-pulse mix-blend-screen"
            />
          </div>

          {/* الفيديو الرئيسي معروض بشفافية كاملة دائماً ليظهر فور وروده */}
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}video_1773620069481190.mp4`}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finish}
            onError={finish}
            onPlaying={() => {
              // اختياري: إذا كان الفيديو يشتغل بشكل جيد
            }}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />

          {/* طبقة سوداء تظهر عند الـ fade للانتقال للموقع */}
          <motion.div
            className="absolute inset-0 bg-[#050302] pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "fade" ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
