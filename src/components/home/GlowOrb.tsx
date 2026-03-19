"use client";

import { motion } from "framer-motion";

interface GlowOrbProps {
  color: string;
  size: number;
  x: string;
  y: string;
  delay?: number;
}

export default function GlowOrb({ color, size, x, y, delay = 0 }: GlowOrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color}40, ${color}10, transparent)`,
        filter: "blur(40px)",
      }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 15, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
        opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}
