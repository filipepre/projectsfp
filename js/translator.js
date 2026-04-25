let translations = {};

async function loadTranslations() {
  const BASE_URL = location.hostname === "filipepre.github.io" ? "/projectsfp" : "";
  const res = await fetch(BASE_URL + '/locales/locales.json');
  translations = await res.json();
}

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");

    const value = translations?.[lang]?.[key];

    if (value) {
      el.textContent = value;
    }
  });
}

function initLanguageSelector() {
  const selector = document.getElementById("languageSwitcher");

  if (!selector) {
    setTimeout(initLanguageSelector, 200);
    return;
  }

  // idioma guardado ou default
  const savedLang = localStorage.getItem("lang") || "pt";

  selector.value = savedLang;
  applyLanguage(savedLang);

  selector.addEventListener("change", (e) => {
    const lang = e.target.value;

    localStorage.setItem("lang", lang);
    applyLanguage(lang);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadTranslations();

  const savedLang = localStorage.getItem("lang") || "pt";
  applyLanguage(savedLang);

  initLanguageSelector();
});