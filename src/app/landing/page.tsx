"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "What is Syncro-Link?",
    a: "Syncro-Link is a world wide index for people of the light to unite, collaborate and anchor the gamma frequencies of the new earth energy en masse. It is a free, non-commercial network where lightworkers, starseeds, healers and conscious beings find each other and coordinate heart centered group coherence.",
  },
  {
    q: "How do I join?",
    a: "Head to the Registry and fill out a short three-page form. You choose a network name, write a brief intro about yourself, pick your daily light color, upload a photo and you appear on the World Grid as a point of light.",
  },
  {
    q: "What is the World Grid?",
    a: "The World Grid is a real-time 3D globe and street map showing every registered member as a point of light. Click on any point to see that person's bio and network name. It is how we find each other locally and globally.",
  },
  {
    q: "What is a Heart Centered Anchor Breath?",
    a: "It is the core practice of Syncro-Link. A specific breathing technique where you place both hands on your heart center and breathe with sincerity, reverence, gratitude and silence. Each breath takes about 21 seconds and each session is six breaths. Full instructions are on the Meditation page.",
  },
  {
    q: "What are Frequency Anchors?",
    a: "Every heart coherent breath you take is a frequency anchor. When you register you choose a light color that corresponds to how many anchors you intend to set each day. The Anchorhythm page tracks the total anchors being set world wide in real time.",
  },
  {
    q: "What do the light colors mean?",
    a: "White Star is 18 anchors per day (3 sessions, 9 minutes). Emerald Crystal is 54 per day (9 sessions, 27 minutes). Blue Sapphire Plasma is 108 per day (18 sessions, 54 minutes). Violet Resurrection Flame is 162 per day (27 sessions, 81 minutes). Golden Ground is all day presence.",
  },
  {
    q: "Is there a chat?",
    a: "Yes. Registered members can create chat rooms and invite others in by their Syncro-Link network name. You can find members on the World Grid and connect with them directly. Everything shared on Syncro-Link is free, always.",
  },
  {
    q: "Does it cost anything?",
    a: "No. Syncro-Link is completely free and always will be. The number one rule of the network is No Capitalism Whatsoever. There is no selling, no pitching, no monetization of any kind. This is a network, not a business.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.04] backdrop-blur-sm"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-white/90 font-semibold text-sm sm:text-base pr-4">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-4 text-white/60 text-sm leading-relaxed">{a}</p>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background app icon */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/icons/app-icon.png"
          alt=""
          className="w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] opacity-[0.04] select-none"
          draggable={false}
        />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.img
          src="/icons/app-icon.png"
          alt="Syncro-Link"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.35)] mb-8"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.25em] text-white text-center mb-4 drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
        >
          SYNCRO-LINK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white/70 text-base sm:text-lg max-w-xl mx-auto text-center leading-relaxed mb-6"
        >
          The World Wide Index for people of the light to unite, collaborate and
          anchor the gamma frequencies of the new earth energy en masse.
        </motion.p>

        {/* Scroll indicator */}
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

      {/* FAQ Section */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-center tracking-wider text-white mb-12"
        >
          How It Works
        </motion.h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] backdrop-blur-sm p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center tracking-wider text-emerald-300 mb-6">
            Security &amp; Privacy
          </h2>

          <div className="space-y-4 text-white/70 text-sm leading-relaxed">
            <p>
              Syncro-Link takes the security of your information seriously. Our
              platform is built with modern, industry-standard security practices
              to keep your data safe.
            </p>

            <div className="space-y-2">
              <p className="text-white/90 font-semibold text-xs uppercase tracking-wider">
                What We Implement
              </p>
              <ul className="space-y-1.5 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#9679;</span>
                  <span>All passwords are encrypted using bcrypt hashing and are never stored in plain text. Not even we can read them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#9679;</span>
                  <span>Sessions are protected with signed, encrypted JWT tokens with automatic expiration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#9679;</span>
                  <span>All session cookies are HTTP-only and secure, preventing cross-site scripting attacks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#9679;</span>
                  <span>Sensitive information such as passwords and email addresses are never exposed through any public-facing interface or API.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#9679;</span>
                  <span>All data-modifying actions require authenticated sessions. File uploads, profile edits, chat messages and posts are all protected.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#9679;</span>
                  <span>Security headers are enforced across the entire platform including clickjacking protection, content type enforcement and referrer policies.</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-white/90 font-semibold text-xs uppercase tracking-wider mb-2">
                Our Promise to You
              </p>
              <p>
                Your information will <strong className="text-white">never</strong> be
                shared, sold, traded, leased, or distributed to any third party
                for any reason, ever. Syncro-Link is not a business. There is no
                monetization. There are no analytics trackers, no advertising
                pixels, no data harvesting of any kind. Your data exists solely
                to connect you with fellow members of the network. That is its
                only purpose and it will remain that way for as long as
                Syncro-Link exists.
              </p>
            </div>

            <p className="text-white/40 text-xs text-center pt-2">
              Syncro-Link is an open network built on trust, transparency and
              the shared intent of unity.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 text-center pb-20">
        <Link
          href="/home"
          className="group relative inline-flex items-center justify-center"
        >
          {/* Outer pulse ring */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 opacity-40 blur-lg animate-[pulse_2s_ease-in-out_infinite]" />
          {/* Inner pulse ring */}
          <span className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 opacity-20 blur-md animate-[pulse_2.5s_ease-in-out_infinite_0.5s]" />
          {/* Button */}
          <span className="relative px-12 sm:px-16 py-5 sm:py-6 rounded-full font-bold text-xl sm:text-2xl tracking-wider text-white bg-gradient-to-r from-purple-700 via-indigo-600 to-emerald-600 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transition-all duration-500 hover:scale-105">
            Enter the Grid
          </span>
        </Link>
      </section>
    </div>
  );
}
