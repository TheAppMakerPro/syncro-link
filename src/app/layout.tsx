import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CosmicBackground from "@/components/layout/CosmicBackground";
import Footer from "@/components/layout/Footer";
// Translation is handled directly in the Navbar component

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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Syncro-Link — Unite and Enlight",
    description:
      "The world wide index for people of the light to unite, collaborate and anchor the gamma frequencies of the new earth energy en masse.",
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
    title: "Syncro-Link — Unite and Enlight",
    description:
      "The world wide index for people of the light to unite and anchor the new earth frequency.",
    images: ["/icons/app-icon.png"],
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
      <body className="min-h-screen gradient-bg font-[var(--font-inter)] antialiased overflow-x-hidden">
        <CosmicBackground />
        <Navbar />
        <main className="relative z-10 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
