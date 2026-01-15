"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const BlurText = ({ children, className, delay = 0 }: BlurTextProps) => {
  return (
    <motion.span
      initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.8, 0.25, 1], // Pomegranate ease
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
};
