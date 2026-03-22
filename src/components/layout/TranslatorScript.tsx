"use client";

import { useEffect } from "react";

export default function TranslatorScript() {
  useEffect(() => {
    // Load translator.js directly
    if ((window as any).Translator) return;

    const script = document.createElement("script");
    script.src = "/translator.js";
    script.async = true;
    script.onload = () => {
      (window as any).Translator?.init({
        defaultLang: "en",
        position: "bottom-right",
        autoRestore: true,
      });
      // Hide the built-in floating picker
      const picker = document.getElementById("translator-picker");
      if (picker) picker.style.display = "none";
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
