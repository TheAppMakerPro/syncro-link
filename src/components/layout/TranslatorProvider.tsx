"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Translator?: {
      init: (opts: Record<string, unknown>) => void;
      destroy: () => void;
      refresh: () => void;
    };
  }
}

export default function TranslatorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/translator.js";
    script.onload = () => {
      window.Translator?.init({
        defaultLang: "en",
        position: "bottom-right",
        autoRestore: true,
      });
    };
    document.body.appendChild(script);
    return () => {
      if (window.Translator) window.Translator.destroy();
      script.remove();
    };
  }, []);

  // Refresh translations on route change
  const pathname = usePathname();
  useEffect(() => {
    window.Translator?.refresh();
  }, [pathname]);

  return <>{children}</>;
}
