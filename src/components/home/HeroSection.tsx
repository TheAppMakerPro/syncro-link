"use client";

import { motion } from "framer-motion";
import GlowOrb from "./GlowOrb";


export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <GlowOrb color="#ffd700" size={300} x="10%" y="20%" delay={0} />
      <GlowOrb color="#a855f7" size={250} x="70%" y="15%" delay={3} />
      <GlowOrb color="#3b82f6" size={200} x="50%" y="60%" delay={6} />
      <GlowOrb color="#10b981" size={180} x="80%" y="70%" delay={9} />

      <div className="relative z-10 text-center max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.25em] text-white mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
        >
          SYNCRO-LINK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg sm:text-xl text-white/90 font-light tracking-[0.15em] mb-3"
        >
          The World Wide Index
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
        >
          For people of the light to unite, collaborate and anchor the gamma
          frequencies of the new earth energy en masse.
        </motion.p>

      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}
