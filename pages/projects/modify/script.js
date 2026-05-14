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

const STORAGE_KEY = "projects";

// 🔍 obter ID da URL
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// 📥 carregar dados no formulário
function loadProject() {
  const id = getProjectId();
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const project = projects.find(p => p.id === id);

  if (!project) {
    alert("Projeto não encontrado");
    return;
  }

  document.getElementById("name").value = project.name;
  document.getElementById("description").value = project.description;

  // ⚠️ converter data para formato input[type=date]
  if (project.limit_date && project.limit_date.includes("/")) {
    const [day, month, year] = project.limit_date.split("/");
    document.getElementById("limit_date").value = `${year}-${month}-${day}`;
  } else {
    document.getElementById("limit_date").value = project.limit_date;
  }
}

// 💾 guardar alterações
function save() {
  const id = getProjectId();
  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    alert("Erro ao atualizar");
    return;
  }

  // converter data de volta para DD/MM/YYYY
  const rawDate = document.getElementById("limit_date").value;
  let formattedDate = rawDate;

  if (rawDate) {
    const [year, month, day] = rawDate.split("-");
    formattedDate = `${day}/${month}/${year}`;
  }

  // atualizar só os campos necessários
  projects[index].name = document.getElementById("name").value;
  projects[index].description = document.getElementById("description").value;
  projects[index].limit_date = formattedDate;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  alert("Projeto atualizado!");
  goBack();
}

// 🔙 voltar
function goBack() {
  window.location.href = "../index.html";
}

// 🚀 init
document.addEventListener("DOMContentLoaded", loadProject);