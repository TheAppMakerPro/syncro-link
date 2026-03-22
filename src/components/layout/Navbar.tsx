"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Globe } from "lucide-react";
import ChatNotificationBadge from "@/components/chat/ChatNotificationBadge";

const TOP_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "ru", label: "Русский" },
  { code: "nl", label: "Nederlands" },
  { code: "sv", label: "Svenska" },
  { code: "pl", label: "Polski" },
  { code: "tr", label: "Türkçe" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "he", label: "עברית" },
];

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/registry", label: "Registry" },
  { href: "/world-grid", label: "World Grid" },
  { href: "/right-light", label: "The Right Light" },
  { href: "/shift-mechanics", label: "Shift Mechanics" },
];

const authLinks = [
  { href: "/", label: "Home" },
  { href: "/world-grid", label: "World Grid" },
  { href: "/right-light", label: "The Right Light" },
  { href: "/shift-mechanics", label: "Shift Mechanics" },
  { href: "/chat", label: "Chat" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const pathname = usePathname();

  const getCacheKey = (text: string, lang: string) => `t|${lang}|${text.slice(0, 80)}`;

  const translateOne = async (text: string, lang: string): Promise<string> => {
    if (!text.trim()) return text;
    const key = getCacheKey(text, lang);
    const cached = localStorage.getItem(key);
    if (cached) return cached;

    try {
      // Google Translate free endpoint — no API key, no daily limit
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text.slice(0, 500))}`;
      const res = await fetch(url);
      const data = await res.json();
      // Response format: [[["translated text","original text",...],...],...]
      const result = (data?.[0] as Array<Array<string>>)?.map((s: Array<string>) => s[0]).join("");
      if (result && !result.includes("WARNING")) {
        localStorage.setItem(key, result);
        return result;
      }
    } catch { /* keep original */ }
    return text;
  };

  const handleLangChange = async (code: string) => {
    setCurrentLang(code);
    setLangOpen(false);
    localStorage.setItem("syncro_lang", code);

    if (code === "en") {
      document.querySelectorAll("[data-orig]").forEach((el) => {
        el.textContent = el.getAttribute("data-orig");
      });
      return;
    }

    const selectors = "h1,h2,h3,h4,h5,h6,p,a,button,label,span,li,blockquote,figcaption,legend";
    const elements = Array.from(document.querySelectorAll(selectors)).filter((el) => {
      const ownText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => (n.textContent || "").trim())
        .join("");
      return ownText.length > 1 && !el.closest(".leaflet-container,script,style");
    });

    // Save originals
    elements.forEach((el) => {
      if (!el.getAttribute("data-orig")) {
        el.setAttribute("data-orig", el.textContent || "");
      }
    });

    // Translate 6 at a time in parallel for speed
    const BATCH = 6;
    for (let i = 0; i < elements.length; i += BATCH) {
      const batch = elements.slice(i, i + BATCH);
      const results = await Promise.all(
        batch.map((el) => translateOne(el.getAttribute("data-orig") || "", code))
      );
      batch.forEach((el, j) => {
        if (results[j]) el.textContent = results[j];
      });
    }
  };

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, [pathname]);

  const links = authed ? authLinks : publicLinks;
  const authAction = authed
    ? null
    : { href: "/login", label: "Sign In" };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Sparkles className="h-5 w-5 text-amber-300 transition-transform group-hover:rotate-12" />
          <span className="text-lg font-bold tracking-[0.2em] text-white">
            SYNCRO-LINK
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm transition-colors ${
                  active
                    ? "text-amber-300 font-semibold"
                    : "text-white/70 hover:text-white font-medium"
                }`}
              >
                <span className="relative">
                  {link.label}
                  {link.href === "/chat" && <ChatNotificationBadge />}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-amber-300"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          {authAction && (
            <Link
              href={authAction.href}
              className="ml-2 px-5 py-1.5 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors"
            >
              {authAction.label}
            </Link>
          )}

          {/* Language selector */}
          <div className="relative ml-2">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
              title="Translate"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{currentLang}</span>
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-48 max-h-72 overflow-y-auto rounded-xl bg-black/90 backdrop-blur-xl border border-white/15 shadow-2xl py-1">
                  {TOP_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentLang === lang.code
                          ? "text-amber-300 bg-white/10 font-semibold"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-purple-950/90 backdrop-blur-xl"
          >
            <div className="flex flex-col p-4 gap-1">
              {links.map((link) => {
                const active = pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-white/10 text-amber-300 font-semibold"
                        : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
                    }`}
                  >
                    <span className="relative">
                      {link.label}
                      {link.href === "/chat" && <ChatNotificationBadge />}
                    </span>
                  </Link>
                );
              })}
              {authAction && (
                <Link
                  href={authAction.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm text-purple-300 hover:bg-white/5 font-semibold"
                >
                  {authAction.label}
                </Link>
              )}
              {/* Mobile language selector */}
              <div className="border-t border-white/10 mt-2 pt-2">
                <p className="px-4 py-1 text-xs text-white/30 font-semibold uppercase tracking-wider">Language</p>
                <div className="grid grid-cols-2 gap-1 px-2">
                  {TOP_LANGUAGES.slice(0, 10).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { handleLangChange(lang.code); setOpen(false); }}
                      className={`px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                        currentLang === lang.code
                          ? "text-amber-300 bg-white/10 font-semibold"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
