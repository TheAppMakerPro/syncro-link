"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const VOICEOVER_TEXT = `The thumbs, representative of fire, are cross connected and rest upon the high heart, which is the crossing point between the 4th and 5th density. The high heart is both your central exchange point and your bridge upwards. The 5th density rests upon the high heart.

Your fingers are spread out to lace the energy constantly erupting from your finger tips into the brachial nerve plexus which cycles it back into the arms at the shoulders and then down into the hands to form a continual figure eight current. Your palm chakras resting at each side of the high heart center, create a dynamic balance and slight gyroscopic effect.

Now let us begin the breath.

Get comfortable. Standing or sitting if possible.

Take a deep slow clearing breath through your mouth and empty your body of its air, feel any stagnant energy leave your cells and exit through all of your skin and out of your mouth. Then, allow your attention to drift softly down to surround and enter your heart center. Hold your attention there like a field of silent intelligence. Settle yourself and take another full clearing breath, seeing the stagnant energy leave your system for the second time. Settle and drop your focus again into your heart center.

As you slowly inhale for a count of six imagine a golden thread about the width of your pinky finger. This thread extends from the central sun of the entire cosmos all the way to and then through our local sun and directly into the crown of your head.

From there it lights up your body as a silvery deep cobalt-sapphire blue and gold plasma that bathes your brain and your hypothalamic-pituitary-pineal axis, in gamma radiation.

Then it flows down your spine and the front of your body through the 12 paired cranial nerves, especially the 10th cranial nerve which is your vagus nerve.

Feel the blue gold plasma energy enter your heart Chakra which is a deep emerald green crystal sphere encased within an octahedral crystal of powdery gold. This octahedral crystal has its upper point at the base of your throat and its lower point behind your navel. Its base is oriented with points at the center of the sternum and the fifth thoracic.

We use this geometry of the octahedral shape to create a pattern that can be nested within. It is also the geometrical element of air, which is the nature of anahata, the heart chakra. The smaller octahedral of your heart nested in the center of Gaia's octahedral crystal is like an ancient key in the field of infinity.

As well, when the toroidal field of your light body is perfectly synchronized and nested in harmony with the toroidal field of Gaia, which is emitted from Her north and south pole openings, extraordinary alignment and power is made available for calibration.

Feel the heart chakra begin to pulse with the same crystal configuration that floats within the fifth density hollow center of earth. This geometry at the hollow core of 5d earth is the identical holographic octahedral geometry around your heart. Feel your own heart crystal merge with Gaia's.

This is what you make happen in the six count inhalation. All of this visualization and working awareness becomes fluid with repetition.

As you now hold the breath for a count of six, visualize the gold, silvery cobalt sapphire blue and emerald green frequencies spreading from your heart through the blood to all the cells in your body. Feel it spreading through every atom of your organs, glands, nerve fiber, fascia, bone marrow, muscles and tendons. Feel it turning you into pure faultless crystal.

Feel it extending out from your body as a million tiny intelligent filaments of light exiting every cell and forming a counter rotating toroidal field twenty seven feet in every direction from your heart. Hear the subtle click and precise high pitched hum of this toroidal field as your attention ignites it into motion. You are now completely permeated with your own high frequency.

Smile to yourself.

You are the shift.

Now exhale for a count of six and imagine the toroidal field around you humming with precision as all the 33 to 99 hertz gamma frequency you just brought forth from the central sun flows out of your heart crystal, down through your body and out through your feet as a root system which grows deep into the mantle of the earth.

Simultaneously, visualize this light shooting down the central channel of your spine as the direct line of your golden thread. Send this golden thread out from your perineum directly into the core crystal of 5d earth.

This crystal is known as the Agarthic Sun. It emits a frequency known as the Green Fire. Which is why the Aurora Borealis is most often green. Feed your anchor into this fire at the center of Gaia's crystalline heart.

Feel it deliver all of your sincerity, all of your reverence and respect, all of your silent power and gratitude into the earth, who is literally your cosmic mother. Allow all of your high frequency light to anchor and settle into Her.

Smile to yourself.

You are the shift.

At the bottom of the breath hold yourself empty for a count of three. Then begin again with your attention upon both the heart and the very beginning of your cosmic thread within the central sun.

This is a heart centered coherent breath with near full visualization. The rest of the visualization involves spirals which we will get into later.

One breath takes 21 to 22 seconds. Centering, lowering your attention to your heart and breathing this way for six breaths takes about three minutes.

Every time you spend these three silent focused minutes of heart centered presence in deep gratitude, reverence and sincerity with conscious awareness of having your radiating heart connected to the center of the planet, smile to yourself. You are the shift.

At the end of any three minute session, you may feel the urge to vocalize something at this point. This is a great time to invoke your I am presence.

I am the Sovereign Heart Presence illuminating the new 5th density earth. All time lines converge through me. I am the balance point. I am the crystal clear prism. Or something like that. Whatever you are moved to command and create.

Then, with your heart on fire and your eyes streaming with tears of joy, say thank you to Gaia, the Universe, all aspects of your self through time and your offworld brothers and sisters. Or something like that.

Also, after an energy centric coherence breathing session it is good to stretch, take a short walk, bend over and touch your toes, lift your knees up to your chest one at a time as you stand, any type of conscious purposeful movement to settle the frequency further into your physical body. And drink some water you have blessed and thanked. It is the liquid crystal assisting magnificently in your DNA activations.

Bring steady, slow even consistency to your practice. Take it easy. Your ability to rest in unhurried silence is paramount to the process. But it takes time to develop a natural skill at this. So don't be hard on yourself. Don't rush. Work on one part of the visualization at a time. Hold gratitude in your heart. Be patient. The 5th density is a much nicer frequency to exist in, but you must approach softly with sincere reverence and gratitude. And remain there in silent allowance.

I surrender. I trust. I allow. I receive.

I am love, the infinite presence of perfect mathematical harmony, clarity and allowance.

Or something like that.`;

// Split text into chunks at paragraph breaks to avoid Android Chrome cutoff bug
function chunkText(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function VoiceOverButton() {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const cancelledRef = useRef(false);

  // Wait for voices to load (async on Android/Chrome)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    const preferred = [
      "Daniel", "Aaron", "Google UK English Male", "Microsoft David",
      "Google US English", "Rishi", "Fred", "Alex",
    ];
    for (const name of preferred) {
      const v = voices.find((voice) => voice.name.includes(name));
      if (v) return v;
    }
    const english = voices.find((v) => v.lang.startsWith("en"));
    return english || voices[0] || null;
  }, [voices]);

  const speakNextChunk = useCallback(() => {
    if (cancelledRef.current) return;
    const chunks = chunksRef.current;
    const idx = currentChunkRef.current;

    if (idx >= chunks.length) {
      setPlaying(false);
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(chunks[idx]);
    utterance.rate = 0.55;
    utterance.pitch = 0.8;
    utterance.volume = 1;

    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      currentChunkRef.current = idx + 1;
      speakNextChunk();
    };
    utterance.onerror = () => {
      setPlaying(false);
    };

    synth.speak(utterance);
  }, [pickVoice]);

  const handleToggle = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    if (playing) {
      cancelledRef.current = true;
      synth.cancel();
      setPlaying(false);
      return;
    }

    cancelledRef.current = false;
    chunksRef.current = chunkText(VOICEOVER_TEXT);
    currentChunkRef.current = 0;
    setPlaying(true);
    speakNextChunk();
  }, [playing, speakNextChunk]);

  if (!supported) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            playing
              ? "bg-white/10 border border-white/20 text-white"
              : "bg-purple-600/80 hover:bg-purple-600 text-white border border-purple-500/30"
          }`}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div>
          <p className="text-white/80 text-sm font-semibold">
            {playing ? "Playing Voice Over..." : "Listen to Voice Over"}
          </p>
          <p className="text-white/40 text-xs">
            Uses your device&apos;s text-to-speech voice
          </p>
        </div>
      </div>
    </div>
  );
}
