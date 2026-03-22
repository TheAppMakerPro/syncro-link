"use client";

import Script from "next/script";

export default function TranslatorLoader() {
  return (
    <Script
      src="/translator.js"
      strategy="lazyOnload"
      onLoad={() => {
        (window as any).Translator?.init({
          defaultLang: "en",
          position: "bottom-right",
          autoRestore: true,
        });
      }}
    />
  );
}
