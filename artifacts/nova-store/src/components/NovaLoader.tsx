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
  const [videoReady, setVideoReady] = useState(false);
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
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      setVideoReady(true);
      video.play().catch(() => {});
    };

    // نستخدم loadeddata لأنها تعني أن أول إطار متاح للرسم
    video.addEventListener("loadeddata", handleReady, { once: true });
    // كفولباك نستخدم canplay أيضاً
    video.addEventListener("canplay", handleReady, { once: true });

    // إذا كان الكاش يحمل البيانات بالفعل
    if (video.readyState >= 2) {
      handleReady();
    }

    // timeout احتياطي للنهاية: 8 ثواني كحد أقصى للودر
    const safetyTimer = setTimeout(finish, 8000);

    return () => {
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
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
          <AnimatePresence>
            {!videoReady && (
              <motion.div
                key="fallback-logo"
                className="absolute inset-0 flex items-center justify-center z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/nova-logo-real.jpg`}
                  alt="NOVA Loading"
                  className="w-48 opacity-40 animate-pulse mix-blend-screen"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* الفيديو الرئيسي يخفي اللوجو ببطء عندما يكون جاهزاً */}
          <motion.video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}video_1773620069481190.mp4`}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finish}
            // نعالج الـ error كفولباك لكي لا يعلق اللودر
            onError={finish}
            className="absolute inset-0 w-full h-full object-cover z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 0.6 }}
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
