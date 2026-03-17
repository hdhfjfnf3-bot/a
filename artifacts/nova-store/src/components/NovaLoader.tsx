import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NovaLoader — بدون شاشة سوداء:
 * • الفيديو يُحمَّل بـ preload="auto" ويبدأ فور جاهزيته
 * • الخلفية تبقى شفافة حتى يعطي الفيديو إشارة canplay
 * • timeout احتياطي 8 ثانية
 */
export function NovaLoader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"loading" | "playing" | "fade" | "out">("loading");

  const finish = () => {
    setPhase("fade");
    setTimeout(() => {
      setPhase("out");
      setTimeout(onDone, 100);
    }, 800);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // جاهز للعرض — ابدأ الفيديو فوراً وأظهره
    const handleCanPlay = () => {
      setPhase("playing");
      video.play().catch(() => {});
    };

    // انتهى الفيديو
    const handleEnded = () => finish();

    video.addEventListener("canplay", handleCanPlay, { once: true });
    video.addEventListener("ended", handleEnded, { once: true });

    // إذا كان جاهزاً بالفعل (readyState >= 3 = HAVE_FUTURE_DATA)
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    // timeout احتياطي 8 ثانية
    const t = setTimeout(finish, 8000);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      clearTimeout(t);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {phase !== "out" && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-black overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* الفيديو — مخفي أثناء التحميل ليُظهر مباشرةً بدون وميض أسود */}
          <motion.video
            ref={videoRef}
            src="/video_1773620069481190.mp4"
            preload="auto"
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "playing" ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
          />

          {/* طبقة سوداء تظهر عند الـ fade */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "fade" ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
