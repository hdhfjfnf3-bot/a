import { createContext, useContext } from "react";
import { motion, type Variants } from "framer-motion";

/* ─── Context ─── */
const RevealCtx = createContext({ revealed: false });
export const useReveal = () => useContext(RevealCtx);

/* ─── Provider يُغلف التطبيق ─── */
export function RevealProvider({
  children,
  revealed,
}: {
  children: React.ReactNode;
  revealed: boolean;
}) {
  return (
    <RevealCtx.Provider value={{ revealed }}>
      {children}
    </RevealCtx.Provider>
  );
}

/**
 * RevealItem — يُغلف أي عنصر ويجعله يظهر تدريجياً
 * delay: ثانية (0.0 = فوراً، 0.2 = بعد 200ms ...)
 * dir: اتجاه الدخول
 */
export function RevealItem({
  children,
  delay = 0,
  dir = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: "up" | "down" | "left" | "right" | "scale";
  className?: string;
}) {
  const { revealed } = useReveal();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: dir === "up" ? 32 : dir === "down" ? -32 : 0,
      x: dir === "left" ? 40 : dir === "right" ? -40 : 0,
      scale: dir === "scale" ? 0.85 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}
