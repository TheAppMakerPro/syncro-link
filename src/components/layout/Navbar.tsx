"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import ChatNotificationBadge from "@/components/chat/ChatNotificationBadge";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/registry", label: "Registry" },
  { href: "/world-grid", label: "World Grid" },
  { href: "/right-light", label: "The Right Light" },
];

const authLinks = [
  { href: "/", label: "Home" },
  { href: "/world-grid", label: "World Grid" },
  { href: "/right-light", label: "The Right Light" },
  { href: "/chat", label: "Chat" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const pathname = usePathname();

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
