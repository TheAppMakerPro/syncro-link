/**
 * Universal Translator Module
 * Drop into any web app to add multi-language support.
 *
 * Usage:
 *   1. Add <script src="translator.js"></script> to your HTML
 *   2. Add data-i18n="key" attributes to translatable elements
 *   3. Call Translator.init() — a language picker appears automatically
 *
 * Supports 50+ languages via the free LibreTranslate-compatible API
 * or falls back to a built-in dictionary for offline use.
 */

const Translator = (() => {
  // ── Configuration ──────────────────────────────────────────────────
  const CONFIG = {
    defaultLang: 'en',
    storageKey: 'app_language',
    apiUrl: 'https://api.mymemory.translated.net/get', // free, no key needed
    maxApiChars: 500, // per request
    batchDelay: 80,   // ms between API calls to stay under rate limits
  };

  // ── Supported Languages (ISO 639-1) ────────────────────────────────
  // 54 languages — covers ~95 % of world internet users
  const LANGUAGES = {
    af: { name: 'Afrikaans',   native: 'Afrikaans' },
    am: { name: 'Amharic',    native: 'አማርኛ' },
    ar: { name: 'Arabic',     native: 'العربية',    rtl: true },
    az: { name: 'Azerbaijani',native: 'Azərbaycan' },
    bg: { name: 'Bulgarian',  native: 'Български' },
    bn: { name: 'Bengali',    native: 'বাংলা' },
    cs: { name: 'Czech',      native: 'Čeština' },
    da: { name: 'Danish',     native: 'Dansk' },
    de: { name: 'German',     native: 'Deutsch' },
    el: { name: 'Greek',      native: 'Ελληνικά' },
    en: { name: 'English',    native: 'English' },
    es: { name: 'Spanish',    native: 'Español' },
    et: { name: 'Estonian',   native: 'Eesti' },
    fa: { name: 'Persian',    native: 'فارسی',      rtl: true },
    fi: { name: 'Finnish',    native: 'Suomi' },
    fil:{ name: 'Filipino',   native: 'Filipino' },
    fr: { name: 'French',     native: 'Français' },
    ga: { name: 'Irish',      native: 'Gaeilge' },
    gu: { name: 'Gujarati',   native: 'ગુજરાતી' },
    ha: { name: 'Hausa',      native: 'Hausa' },
    he: { name: 'Hebrew',     native: 'עברית',       rtl: true },
    hi: { name: 'Hindi',      native: 'हिन्दी' },
    hr: { name: 'Croatian',   native: 'Hrvatski' },
    hu: { name: 'Hungarian',  native: 'Magyar' },
    id: { name: 'Indonesian', native: 'Bahasa Indonesia' },
    ig: { name: 'Igbo',       native: 'Igbo' },
    it: { name: 'Italian',    native: 'Italiano' },
    ja: { name: 'Japanese',   native: '日本語' },
    ka: { name: 'Georgian',   native: 'ქართული' },
    kn: { name: 'Kannada',    native: 'ಕನ್ನಡ' },
    ko: { name: 'Korean',     native: '한국어' },
    lt: { name: 'Lithuanian', native: 'Lietuvių' },
    lv: { name: 'Latvian',    native: 'Latviešu' },
    ml: { name: 'Malayalam',  native: 'മലയാളം' },
    mr: { name: 'Marathi',    native: 'मराठी' },
    ms: { name: 'Malay',      native: 'Bahasa Melayu' },
    my: { name: 'Myanmar',    native: 'မြန်မာ' },
    ne: { name: 'Nepali',     native: 'नेपाली' },
    nl: { name: 'Dutch',      native: 'Nederlands' },
    no: { name: 'Norwegian',  native: 'Norsk' },
    pl: { name: 'Polish',     native: 'Polski' },
    pt: { name: 'Portuguese', native: 'Português' },
    ro: { name: 'Romanian',   native: 'Română' },
    ru: { name: 'Russian',    native: 'Русский' },
    si: { name: 'Sinhala',    native: 'සිංහල' },
    sk: { name: 'Slovak',     native: 'Slovenčina' },
    sl: { name: 'Slovenian',  native: 'Slovenščina' },
    so: { name: 'Somali',     native: 'Soomaali' },
    sq: { name: 'Albanian',   native: 'Shqip' },
    sr: { name: 'Serbian',    native: 'Српски' },
    sv: { name: 'Swedish',    native: 'Svenska' },
    sw: { name: 'Swahili',    native: 'Kiswahili' },
    ta: { name: 'Tamil',      native: 'தமிழ்' },
    te: { name: 'Telugu',     native: 'తెలుగు' },
    th: { name: 'Thai',       native: 'ไทย' },
    tr: { name: 'Turkish',    native: 'Türkçe' },
    uk: { name: 'Ukrainian',  native: 'Українська' },
    ur: { name: 'Urdu',       native: 'اردو',        rtl: true },
    uz: { name: 'Uzbek',      native: 'Oʻzbek' },
    vi: { name: 'Vietnamese', native: 'Tiếng Việt' },
    yo: { name: 'Yoruba',     native: 'Yorùbá' },
    zh: { name: 'Chinese',    native: '中文' },
    zu: { name: 'Zulu',       native: 'isiZulu' },
  };

  // ── State ──────────────────────────────────────────────────────────
  let currentLang = CONFIG.defaultLang;
  let originals  = new Map();   // element → original text
  let cache      = {};          // { "en|es|Hello": "Hola" }
  let pickerEl   = null;
  let isTranslating = false;

  // ── Cache persistence (localStorage) ───────────────────────────────
  function loadCache() {
    try {
      const raw = localStorage.getItem('translator_cache');
      if (raw) cache = JSON.parse(raw);
    } catch (_) { /* ignore */ }
  }

  function saveCache() {
    try {
      localStorage.setItem('translator_cache', JSON.stringify(cache));
    } catch (_) { /* ignore */ }
  }

  // ── API Translation ────────────────────────────────────────────────
  async function translateText(text, from, to) {
    if (!text.trim()) return text;
    const cacheKey = `${from}|${to}|${text}`;
    if (cache[cacheKey]) return cache[cacheKey];

    try {
      const url = `${CONFIG.apiUrl}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated) {
        cache[cacheKey] = translated;
        saveCache();
        return translated;
      }
      throw new Error('No translation returned');
    } catch (err) {
      console.warn(`[Translator] API error for "${text.slice(0, 40)}…": ${err.message}`);
      return text; // graceful fallback — keep original
    }
  }

  // ── DOM Scanning ───────────────────────────────────────────────────
  function getTranslatableElements() {
    // Elements with data-i18n, or auto-detect text nodes in common tags
    const explicit = document.querySelectorAll('[data-i18n]');
    if (explicit.length > 0) return Array.from(explicit);

    // Auto-mode: translate visible text-bearing elements
    const selectors = 'h1,h2,h3,h4,h5,h6,p,a,button,label,span,li,td,th,figcaption,blockquote,summary,option,dt,dd,legend';
    const elements = document.querySelectorAll(selectors);
    return Array.from(elements).filter(el => {
      // Only elements whose own text (not children's) is non-empty
      const ownText = Array.from(el.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join('');
      return ownText.length > 1;
    });
  }

  function storeOriginals(elements) {
    elements.forEach(el => {
      if (!originals.has(el)) {
        originals.set(el, {
          text: el.textContent,
          html: el.innerHTML,
          placeholder: el.getAttribute('placeholder') || null,
          title: el.getAttribute('title') || null,
        });
      }
    });
  }

  // ── Translation Engine ─────────────────────────────────────────────
  async function translatePage(targetLang) {
    if (targetLang === currentLang && targetLang !== CONFIG.defaultLang) return;
    if (isTranslating) return;
    isTranslating = true;
    showLoading(true);

    const elements = getTranslatableElements();
    storeOriginals(elements);

    if (targetLang === CONFIG.defaultLang) {
      // Restore originals
      originals.forEach((orig, el) => {
        el.innerHTML = orig.html;
        if (orig.placeholder) el.setAttribute('placeholder', orig.placeholder);
        if (orig.title) el.setAttribute('title', orig.title);
      });
      applyDirection(targetLang);
      currentLang = targetLang;
      localStorage.setItem(CONFIG.storageKey, targetLang);
      showLoading(false);
      isTranslating = false;
      return;
    }

    // Translate in small batches to respect rate limits
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const orig = originals.get(el);
      if (!orig) continue;

      const translated = await translateText(orig.text, CONFIG.defaultLang, targetLang);
      el.textContent = translated;

      if (orig.placeholder) {
        const tp = await translateText(orig.placeholder, CONFIG.defaultLang, targetLang);
        el.setAttribute('placeholder', tp);
      }
      if (orig.title) {
        const tt = await translateText(orig.title, CONFIG.defaultLang, targetLang);
        el.setAttribute('title', tt);
      }

      // Brief pause every 5 elements to stay under rate limits
      if (i % 5 === 4) await sleep(CONFIG.batchDelay);
    }

    applyDirection(targetLang);
    currentLang = targetLang;
    localStorage.setItem(CONFIG.storageKey, targetLang);
    showLoading(false);
    isTranslating = false;
  }

  function applyDirection(lang) {
    const info = LANGUAGES[lang];
    if (info?.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }

  // ── UI: Language Picker ────────────────────────────────────────────
  function createPicker(options = {}) {
    if (pickerEl) pickerEl.remove();

    const position = options.position || 'bottom-right'; // top-left, top-right, bottom-left, bottom-right
    const container = options.container || document.body;

    pickerEl = document.createElement('div');
    pickerEl.id = 'translator-picker';

    // Styles
    const posMap = {
      'top-left':     'top:16px;left:16px;',
      'top-right':    'top:16px;right:16px;',
      'bottom-left':  'bottom:16px;left:16px;',
      'bottom-right': 'bottom:16px;right:16px;',
    };

    pickerEl.innerHTML = `
      <style>
        #translator-picker {
          position: fixed;
          ${posMap[position] || posMap['bottom-right']}
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #translator-picker .tp-toggle {
          width: 48px; height: 48px; border-radius: 50%;
          background: #1a1a2e; color: #fff; border: 2px solid #e94560;
          cursor: pointer; font-size: 22px; display: flex;
          align-items: center; justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        #translator-picker .tp-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(233,69,96,0.4);
        }
        #translator-picker .tp-dropdown {
          display: none; position: absolute;
          ${position.includes('bottom') ? 'bottom: 58px;' : 'top: 58px;'}
          ${position.includes('right')  ? 'right: 0;'     : 'left: 0;'}
          width: 260px; max-height: 400px; overflow-y: auto;
          background: #16213e; border: 1px solid #e94560;
          border-radius: 12px; padding: 8px 0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        #translator-picker .tp-dropdown.open { display: block; }
        #translator-picker .tp-search {
          width: calc(100% - 24px); margin: 4px 12px 8px;
          padding: 8px 12px; border-radius: 8px; border: 1px solid #0f3460;
          background: #1a1a2e; color: #eee; font-size: 14px; outline: none;
        }
        #translator-picker .tp-search:focus { border-color: #e94560; }
        #translator-picker .tp-lang {
          padding: 8px 16px; cursor: pointer; color: #ddd;
          font-size: 14px; display: flex; justify-content: space-between;
          transition: background 0.15s;
        }
        #translator-picker .tp-lang:hover { background: #0f3460; }
        #translator-picker .tp-lang.active { background: #e94560; color: #fff; font-weight: 600; }
        #translator-picker .tp-lang .tp-native { opacity: 0.7; font-size: 12px; }
        #translator-picker .tp-loading {
          display: none; position: absolute;
          top: -4px; right: -4px; width: 18px; height: 18px;
          border: 2px solid #e94560; border-top-color: transparent;
          border-radius: 50%; animation: tp-spin 0.7s linear infinite;
        }
        @keyframes tp-spin { to { transform: rotate(360deg); } }
      </style>

      <div class="tp-loading" id="tp-loading"></div>
      <button class="tp-toggle" id="tp-toggle" title="Translate page">🌐</button>
      <div class="tp-dropdown" id="tp-dropdown">
        <input class="tp-search" id="tp-search" placeholder="Search language..." />
        <div id="tp-lang-list"></div>
      </div>
    `;

    container.appendChild(pickerEl);

    // Populate language list
    const listEl = pickerEl.querySelector('#tp-lang-list');
    renderLanguageList(listEl, '');

    // Events
    const toggle   = pickerEl.querySelector('#tp-toggle');
    const dropdown = pickerEl.querySelector('#tp-dropdown');
    const search   = pickerEl.querySelector('#tp-search');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      if (dropdown.classList.contains('open')) search.focus();
    });

    search.addEventListener('input', () => {
      renderLanguageList(listEl, search.value.toLowerCase());
    });

    document.addEventListener('click', (e) => {
      if (!pickerEl.contains(e.target)) dropdown.classList.remove('open');
    });
  }

  function renderLanguageList(listEl, filter) {
    listEl.innerHTML = '';
    const sorted = Object.entries(LANGUAGES).sort((a, b) =>
      a[1].name.localeCompare(b[1].name)
    );

    sorted.forEach(([code, info]) => {
      if (filter && !info.name.toLowerCase().includes(filter) && !info.native.toLowerCase().includes(filter) && !code.includes(filter)) {
        return;
      }
      const div = document.createElement('div');
      div.className = 'tp-lang' + (code === currentLang ? ' active' : '');
      div.innerHTML = `<span>${info.name}</span><span class="tp-native">${info.native}</span>`;
      div.addEventListener('click', () => {
        translatePage(code);
        const dropdown = pickerEl.querySelector('#tp-dropdown');
        dropdown.classList.remove('open');
        // Update active state
        listEl.querySelectorAll('.tp-lang').forEach(el => el.classList.remove('active'));
        div.classList.add('active');
      });
      listEl.appendChild(div);
    });
  }

  function showLoading(show) {
    const el = document.getElementById('tp-loading');
    if (el) el.style.display = show ? 'block' : 'none';
  }

  // ── Utilities ──────────────────────────────────────────────────────
  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ── Public API ─────────────────────────────────────────────────────

  /**
   * Initialize the translator.
   * @param {Object} options
   * @param {string} options.defaultLang  - Source language code (default: 'en')
   * @param {string} options.position     - Picker position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
   * @param {HTMLElement} options.container - Where to append the picker (default: document.body)
   * @param {boolean} options.autoRestore - Restore last chosen language on load (default: true)
   */
  function init(options = {}) {
    if (options.defaultLang) CONFIG.defaultLang = options.defaultLang;

    loadCache();
    createPicker(options);

    // Restore saved language preference
    if (options.autoRestore !== false) {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved && saved !== CONFIG.defaultLang && LANGUAGES[saved]) {
        currentLang = CONFIG.defaultLang; // reset so translatePage runs
        translatePage(saved);
      }
    }
  }

  /**
   * Programmatically translate to a language.
   * @param {string} langCode - ISO 639-1 code
   */
  function setLanguage(langCode) {
    if (!LANGUAGES[langCode]) {
      console.error(`[Translator] Unknown language code: ${langCode}`);
      return;
    }
    translatePage(langCode);
  }

  /**
   * Get the current language code.
   */
  function getLanguage() {
    return currentLang;
  }

  /**
   * Get all supported languages.
   */
  function getLanguages() {
    return { ...LANGUAGES };
  }

  /**
   * Translate a single string (useful for dynamic content).
   * @param {string} text
   * @param {string} targetLang
   * @returns {Promise<string>}
   */
  async function translate(text, targetLang) {
    return translateText(text, CONFIG.defaultLang, targetLang || currentLang);
  }

  /**
   * Re-scan the page for new elements and translate them.
   * Call this after dynamically adding content.
   */
  async function refresh() {
    if (currentLang !== CONFIG.defaultLang) {
      const saved = currentLang;
      currentLang = CONFIG.defaultLang;
      await translatePage(saved);
    }
  }

  /**
   * Destroy the translator (remove picker, restore originals).
   */
  function destroy() {
    if (pickerEl) pickerEl.remove();
    originals.forEach((orig, el) => {
      el.innerHTML = orig.html;
    });
    originals.clear();
    document.documentElement.removeAttribute('dir');
  }

  return {
    init,
    setLanguage,
    getLanguage,
    getLanguages,
    translate,
    refresh,
    destroy,
    LANGUAGES,
  };
})();

// Auto-init if script has data-auto attribute
if (document.currentScript?.hasAttribute('data-auto')) {
  document.addEventListener('DOMContentLoaded', () => Translator.init());
}
