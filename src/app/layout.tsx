import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CosmicBackground from "@/components/layout/CosmicBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Syncro-Link — Unite and Enlight",
  description:
    "The world wide index for people of the light to unite, collaborate and anchor the gamma frequencies of the new earth energy en masse.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#4a044e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen gradient-bg text-[#1a1200] font-[var(--font-inter)] antialiased">
        <CosmicBackground />
        <Navbar />
        <main className="relative z-10 pt-16">{children}</main>
      </body>
    </html>
  );
}
