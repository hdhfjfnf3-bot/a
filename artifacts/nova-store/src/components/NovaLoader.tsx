import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NovaLoader — 3 مراحل:
 * 1. "video"  — الفيديو يشتغل + البيانات تتحمل في الخلفية
 * 2. "fade"   — الشاشة تسود
 * 3. يُستدعى onDone فيظهر الموقع عنصراً عنصراً
 */
export function NovaLoader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"video" | "fade" | "out">("video");

  const finish = () => {
    setPhase("fade");
    // نقل السيطرة للموقع بعد اكتمال الـ fade  
    setTimeout(() => {
      setPhase("out");
      setTimeout(onDone, 100);
    }, 900);
  };

  // الفيديو ينتهي
  const handleVideoEnd = () => finish();

  // timeout احتياطي 7 ثانية
  useEffect(() => {
    const t = setTimeout(finish, 7000);
    return () => clearTimeout(t);
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
          {/* الفيديو */}
          <AnimatePresence>
            {phase === "video" && (
              <motion.video
                key="vid"
                ref={videoRef}
                src="/video_1773620069481190.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* طبقة سوداء تغطي الفيديو عند الـ fade */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "fade" ? 1 : 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
