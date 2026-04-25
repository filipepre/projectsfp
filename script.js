document.addEventListener("DOMContentLoaded", async () => {
  const components = [
    { id: "header", path: "./components/header/index.html", js: "./components/header/script.js", css: "./components/header/style.css" },
    { id: "navbar", path: "./components/navbar/index.html", js: "./components/navbar/script.js", css: "./components/navbar/style.css" },
    { id: "dropbox", path: "./components/dropbox/index.html", js: "./components/dropbox/script.js", css: "./components/dropbox/style.css" }
  ];

  for (const c of components) {
    await loadComponent(c.id, c.path, c.js, c.css);
  }
});