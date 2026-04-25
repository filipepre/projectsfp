let translations = {};

async function loadTranslations() {
  const BASE_URL = location.hostname === "filipepre.github.io" ? "/projectsfp" : "";
  const res = await fetch(BASE_URL + '/locales/locales.json');
  translations = await res.json();
}

function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');

    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

function initLanguageSelector() {
  const selector = document.getElementById('languageSwitcher');

  if (!selector) {
    setTimeout(initLanguageSelector, 200);
    return;
  }

  applyLanguage(selector.value);

  selector.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations();
  initLanguageSelector();
});