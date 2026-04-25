const htmlCache = {};
const loadedCss = new Set();
const loadedJs = new Set();

function loadComponent(id, htmlPath, jsPath, cssPath) {
  return new Promise(async (resolve) => {
    
    // HTML cache
    let html;
    if (htmlCache[htmlPath]) {
      html = htmlCache[htmlPath];
    } else {
      const res = await fetch(htmlPath);
      html = await res.text();
      htmlCache[htmlPath] = html;
    }

    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Elemento "${id}" não existe`);
      resolve();
      return;
    }

    el.innerHTML = html;

    // CSS (evita duplicados)
    if (cssPath && !loadedCss.has(cssPath)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssPath;
      document.head.appendChild(link);
      loadedCss.add(cssPath);
    }

    // JS (evita duplicados)
    if (jsPath && !loadedJs.has(jsPath)) {
      const script = document.createElement("script");
      script.src = jsPath;
      script.defer = true;
      document.body.appendChild(script);
      loadedJs.add(jsPath);
    }

    resolve();
  });
}