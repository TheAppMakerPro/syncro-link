"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "gold" | "violet" | "cyan";
  className?: string;
}

const colors = {
  gold: "from-amber-500 to-yellow-400 shadow-amber-500/30 hover:shadow-amber-500/50",
  violet: "from-violet-600 to-purple-500 shadow-violet-500/30 hover:shadow-violet-500/50",
  cyan: "from-cyan-500 to-teal-400 shadow-cyan-500/30 hover:shadow-cyan-500/50",
};

export default function GlowButton({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  variant = "gold",
  className = "",
}: GlowButtonProps) {
  const classes = `inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r ${colors[variant]} shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`;

  const inner = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="outline-none">
      {inner}
    </button>
  );
}
