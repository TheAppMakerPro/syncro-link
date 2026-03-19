"use client";

import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl border border-white/10 bg-[#0d0d2b]/70 backdrop-blur-xl p-6 transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
