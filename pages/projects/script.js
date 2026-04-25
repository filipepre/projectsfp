document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = location.pathname.startsWith("/projectsfp") ? "/projectsfp" : "";

  const components = [
    { id: "header", path: BASE_URL + "/components/header/index.html", js: BASE_URL + "/components/header/script.js", css: BASE_URL + "/components/header/style.css" },
    { id: "navbar", path: BASE_URL + "/components/navbar/index.html", js: BASE_URL + "/components/navbar/script.js", css: BASE_URL + "/components/navbar/style.css" },
    { id: "dropbox", path: BASE_URL + "/components/dropbox/index.html", js: BASE_URL + "/components/dropbox/script.js", css: BASE_URL + "/components/dropbox/style.css" }
  ];

  for (const c of components) {
    await loadComponent(c.id, c.path, c.js, c.css);
  }
});