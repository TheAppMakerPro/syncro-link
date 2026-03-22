import type { Metadata } from "next";
import RegistrationForm from "@/components/registry/RegistrationForm";

export const metadata: Metadata = {
  title: "Register — Syncro-Link Index Registry",
  description:
    "Register yourself as a point of light on the world grid. Join the 144,000 node light grid and anchor the new earth frequency.",
  openGraph: {
    title: "Join Syncro-Link — Become a Point of Light",
    description:
      "Register yourself on the world grid. Unite with lightworkers worldwide and anchor the gamma frequencies of the new earth energy.",
    images: [
      {
        url: "/icons/app-icon.png",
        width: 1248,
        height: 1248,
        alt: "Syncro-Link Index",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Join Syncro-Link — Become a Point of Light",
    description:
      "Register yourself on the world grid. Unite with lightworkers worldwide.",
    images: ["/icons/app-icon.png"],
  },
};

export default function RegistryPage() {
  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Syncro-Link Index Registry
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Register yourself as a point of light on the world grid. This is
            your platform for mass ascension.
          </p>
          <p className="text-white/80 max-w-xl mx-auto mt-4 font-semibold text-sm tracking-wide">
            Welcome to the World Wide 5th Density 144,000 node light grid. Here
            is where the anchoring begins.
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
}
