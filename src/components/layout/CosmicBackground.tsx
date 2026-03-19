"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function CosmicBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 30,
      particles: {
        color: { value: ["#ffffff", "#ffd700"] },
        links: {
          color: "#ffffff",
          distance: 200,
          enable: true,
          opacity: 0.04,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.15,
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: { default: "bounce" as const },
        },
        number: {
          value: typeof window !== "undefined" && window.innerWidth < 768 ? 8 : 18,
          density: { enable: true },
        },
        opacity: {
          value: { min: 0.1, max: 0.35 },
          animation: { enable: true, speed: 0.3, sync: false },
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          grab: { distance: 120, links: { opacity: 0.08 } },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="cosmic-particles"
      options={options}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
