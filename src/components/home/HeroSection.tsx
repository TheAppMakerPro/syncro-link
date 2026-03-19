"use client";

import { motion } from "framer-motion";
import GlowOrb from "./GlowOrb";
import GlowButton from "@/components/ui/GlowButton";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Decorative orbs — subtle on the gradient */}
      <GlowOrb color="#ffd700" size={300} x="10%" y="20%" delay={0} />
      <GlowOrb color="#a855f7" size={250} x="70%" y="15%" delay={3} />
      <GlowOrb color="#3b82f6" size={200} x="50%" y="60%" delay={6} />
      <GlowOrb color="#10b981" size={180} x="80%" y="70%" delay={9} />
      <GlowOrb color="#c084fc" size={150} x="20%" y="75%" delay={12} />

      <div className="relative z-10 text-center max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.3em] text-black mb-6"
          style={{
            textShadow: "0 0 40px rgba(212,168,67,0.3), 0 0 80px rgba(212,168,67,0.15)",
          }}
        >
          SYNCRO-LINK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg sm:text-xl text-black font-light tracking-widest mb-4"
        >
          The World Wide Index
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-black text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          For people of the light to unite, collaborate and anchor the gamma
          frequencies of the new earth energy en masse.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <GlowButton href="/registry" variant="gold">
            Join the Grid
          </GlowButton>
          <GlowButton href="/world-grid" variant="violet">
            View the Map
          </GlowButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#8a6d00]/30 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-[#8a6d00]/50" />
        </div>
      </motion.div>
    </section>
  );
}
