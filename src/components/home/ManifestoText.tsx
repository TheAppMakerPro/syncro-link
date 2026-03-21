"use client";

import { motion } from "framer-motion";
import StarDivider from "@/components/ui/StarDivider";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

function RevealSection({ children, className = "" }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ManifestoText() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <RevealSection>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50 text-center mb-6 font-semibold">
          Message to All
        </p>
        <p className="text-lg leading-relaxed">
          This is a tiny little website. But it has a purpose and in order to
          understand that purpose I ask all of you to actually read what little
          content I have provided for it — essential to the task at hand. This content
          is not for entertainment purposes.{" "}
          <strong>It is the instruction set.</strong> And so we begin...
        </p>
      </RevealSection>

      <StarDivider />

      <RevealSection>
        <p className="text-xl sm:text-2xl leading-relaxed text-center">
          Welcome one and all to the Syncro-Link index. All of us: Starseeds,
          Lightworkers, Earth Mothers, Indigos, Yogis, Priestesses, Volunteers,
          Quantum Minds, New Earthers, 5th Density Shift Participants, Galactic
          Federation Ground Crew, the 144,000 Human Nodes of the Crystalline
          Earth Grid, Nature Lovers, Animal Whisperers, Shamans, Teachers,
          Healers, and all the good people of Earth who feel they are here for
          a greater purpose — may we all find each other right now.
        </p>
        <p className="text-2xl sm:text-3xl text-center mt-6 font-bold tracking-wide">
          Let us all unite and enlight.
        </p>
      </RevealSection>

      <StarDivider />

      <RevealSection>
        <p className="text-lg leading-relaxed">
          Syncro-Link is for everybody who wants to live on a planet that both
          serves and is cared for by an enlightened collective — rather than a
          planet that is pillaged, plundered and divided in the name of
          &apos;forced controlled progress&apos; at any cost.
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-xl leading-relaxed text-center font-medium">
          That&apos;s right. The old 3D matrix is collapsing. It&apos;s the end
          of the world as we know it. And the beginning of a new one.
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-lg leading-relaxed">
          Ideally, we join together at the community level, form groups of like
          minded individuals and get to know each other. From there, maybe we
          meditate together. Form sacred circles. Toning sessions. Singing. Tai
          Chi. Breathing. Quiet meaningful conversation. Whatever develops in
          the name of anchoring frequency.
        </p>
      </RevealSection>

      <StarDivider />

      <RevealSection>
        <p className="text-lg leading-relaxed">
          The ultimate goal of Syncro-Link is that one day we all stand up
          together and{" "}
          <strong>
            weave a tapestry of light all around the planet as one unified voice in real time.
          </strong>{" "}
          As the index grows that unified intent will present itself.
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-lg leading-relaxed">
          This is where the Syncro-Link index global positioning map comes in.
          We want to cover this map in wonderful little points of light, each
          point representing one of us and the general vicinity in which we
          dwell and anchor our light everyday. It&apos;s time we saw just how
          many of us there are. This alone will create a massive tidal wave of
          shared presence.
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-lg leading-relaxed">
          Click on any point of light on the global index map and up pops our
          mini home page and personalized intro message. This is the index.
          This will enable all of us to contact each other at will and
          coordinate quiet community events of shared presence together.
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-lg leading-relaxed">
          Let us all share the experience of anchoring the new light on the
          planet and exponentially empower the grid with millions of aligned
          souls all working as one unified intent. The shift is upon us.
          Let&apos;s intend that it plays out with ease, creativity and joy for all.
        </p>
      </RevealSection>

      <StarDivider />

      <RevealSection>
        <p className="text-xl leading-relaxed text-center font-medium">
          So register yourself. Write a little paragraph introducing yourself.
          Post whatever art, pics or information you want to share. But
          remember, the registration section is not a coronation biography, or
          the construction of a shopping cart. It is about finding all the
          locals in your area and all over the world who are ready to combine
          energies and blend with Gaia as one unified field of consciousness.
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-lg leading-relaxed">
          Syncro-Link is how we all find each other, get together and anchor
          the new frequency of 5th Density Earth as a group instead of
          individuals. One ongoing, grand mutual collaboration of light.
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-2xl text-center font-bold tracking-wide">
          That&apos;s it. Register. Check your spot on the Global map. And Unite!
        </p>
      </RevealSection>

      <RevealSection>
        <p className="text-lg leading-relaxed text-center">
          Let&apos;s cover the world in the light of the new earth gamma frequency,
          one conscious heart centered breath at a time.
        </p>
      </RevealSection>

      <StarDivider />

      {/* The Right Light intro */}
      <RevealSection>
        <h2 className="text-3xl font-bold text-center tracking-wider mb-6">
          THE RIGHT LIGHT
        </h2>
        <p className="text-lg leading-relaxed">
          To all of you creators out there — We know all of you have experienced
          wonderful visions about how energy works and what is happening right
          now during this great transition.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Please share whatever you feel relevant with the entire network in the
          RIGHT LIGHT section.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          The RIGHT LIGHT is about posting any miraculous heartwarming
          sentiment, any reports of Earthlings doing the RIGHT thing for the
          collective whole, plus any new forms of real transparency, healing,
          outpourings of love and all points in between. Just good stuff. No
          negative conspiracy news.{" "}
          <strong>
            Only authentic high vibration news concerning the creation of 5D earth.
          </strong>{" "}
          All set in the right light.
        </p>
      </RevealSection>

      <StarDivider />

      {/* The 3 Rules */}
      <RevealSection>
        <h2 className="text-2xl font-bold text-center tracking-wider mb-8">
          The 3 Rules of the Network
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-purple-400/30 bg-purple-500/15 p-5">
            <p className="font-bold text-purple-300 mb-1">1. No Capitalism Whatsoever</p>
            <p className="leading-relaxed">
              Not even the faintest glimmer of monetizing spirituality or anything
              else. No selling, no pitching, no scheduling, no hocking of thyne
              wares in any form. Any advice, product, or idea you have to share
              with the Syncro-Link community, is free and you can share it in
              the RIGHT LIGHT section with no strings attached.
            </p>
          </div>
          <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/15 p-5">
            <p className="font-bold text-indigo-300 mb-1">2. Be Nice</p>
            <p className="leading-relaxed">No bad actors.</p>
          </div>
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 p-5">
            <p className="font-bold text-emerald-300 mb-1">3. Unite and Enlight</p>
            <p className="leading-relaxed">No doom and gloom.</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection>
        <p className="text-xs text-white/40 leading-relaxed text-center">
          * Any offer using the name or branding of &apos;Syncro-Link&apos; is
          explicitly NOT condoned by the network. The incessant scarcity driven
          greed grab has no footing here. There is no Syncro-Link.com.
          Syncro-Link is a network, an organisation, not a business. So
          you&apos;ll have to make your own t-shirt, we don&apos;t sell them here.
        </p>
      </RevealSection>

      <StarDivider />

      {/* Closing */}
      <RevealSection>
        <div className="text-center space-y-5">
          <p className="text-lg leading-relaxed">
            Bless you all! You are the light of the new world. Literally. I
            thank all of you from the very center of my heart on this most
            wonderful and glorious day. Syncro-Link has been a dream of mine
            since 1996. I have just been waiting for the appropriate thresholds
            of consciousness to emerge... thresholds we are all flying past
            right now at this very moment. Congratulations to all of you.
          </p>
          <p className="text-lg leading-relaxed">
            So, now that we have all woken up in our own miraculous ways, let us
            show the world the power of heart centered group coherence and
            unified mass intent.
          </p>
          <p className="text-xl font-medium italic">
            Love, light, peace and ringing ears for All! Let &apos;em ring!
          </p>
          <p className="text-white/40 text-sm">— Chris</p>
        </div>
      </RevealSection>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center pt-4 pb-2"
      >
        <a
          href="/registry"
          className="inline-flex items-center justify-center px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-purple-700 via-indigo-600 to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
        >
          Register Now — Join the Grid
        </a>
      </motion.div>
    </div>
  );
}
