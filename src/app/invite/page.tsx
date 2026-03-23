import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Join Syncro-Link — Become a Point of Light",
  description:
    "Register yourself on the world grid. Unite with lightworkers worldwide and anchor the gamma frequencies of the new earth energy.",
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
    card: "summary_large_image",
    title: "Join Syncro-Link — Become a Point of Light",
    description:
      "Register yourself on the world grid. Unite with lightworkers worldwide.",
    images: ["/icons/app-icon.png"],
  },
};

export default function InvitePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Link href="/home">
          <img
            src="/icons/app-icon.png"
            alt="Syncro-Link Index"
            className="w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.4)] hover:shadow-[0_0_80px_rgba(168,85,247,0.6)] transition-shadow duration-300 cursor-pointer"
          />
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-bold tracking-wider mt-8 mb-4"
          style={{ fontFamily: "var(--font-space)" }}
        >
          Syncro-Link
        </h1>

        <p className="text-white/60 mb-8 leading-relaxed">
          Join the World Wide 5th Density 144,000 node light grid.
          Register yourself as a point of light on the world grid.
        </p>

        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-purple-600 text-white font-bold text-sm hover:bg-purple-500 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          Become a Point of Light
        </Link>
      </div>
    </div>
  );
}
