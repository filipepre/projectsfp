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

  // 🔥 só agora carregas os projetos
  await loadProjects();
});

//Ler o projects.json
const STORAGE_KEY = "projects";

async function loadProjects() {
  let projects = localStorage.getItem(STORAGE_KEY);

  if (projects) {
    // já existe no localStorage
    projects = JSON.parse(projects);
  } else {
    // fetch inicial
    const BASE_URL = location.pathname.startsWith("/projectsfp") ? "/projectsfp" : "";
    const res = await fetch(BASE_URL + "/data/projects.json");
    projects = await res.json();

    // guardar localmente
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  renderProjects(projects);
}

//Ler a informação do localStorage
function renderProjects(projects) {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = ""; // limpar antes de renderizar

  projects.forEach(project => {
    const row = document.createElement("tr");

    // Nome
    row.innerHTML += `<td>${project.name}</td>`;

    // Descrição
    row.innerHTML += `<td>${project.description}</td>`;

    // Tarefas
    const tasksHTML = `
    <table>
    <tbody>
    ${project.tasks.map(task => {
      const status = task.status === 1 ? "✅" : "❌";

      return `
        <tr>
          <td>${status}</td>
          <td>${task.description}</td>
          <td>${task.limit_date}</td>
        </tr>
      `;
    }).join("")}
    </tbody>
    </table>
    `;

    row.innerHTML += `<td>${tasksHTML}</td>`;

    // Datas
    row.innerHTML += `<td>${project.creation_date}</td>`;
    row.innerHTML += `<td>${project.limit_date}</td>`;

    // Status
    row.innerHTML += `<td>${project.status === 1 ? "✅" : "❌"}</td>`;

    // Ações
    const actionCell = document.createElement("td");
    actionCell.classList.add("action-cell");

    const buttonEdit = document.createElement("button");
    buttonEdit.textContent = "✏️";
    buttonEdit.onclick = () => {
      window.location.href = `modify/index.html?id=${project.id}`;
    };

    const buttonRemove = document.createElement("button");
    buttonRemove.textContent = "🗑️";
    buttonRemove.onclick = () => removeProject(project.id);

    actionCell.appendChild(buttonEdit);
    actionCell.appendChild(buttonRemove);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  });
}

//Apagar dados
function removeProject(id) {
  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  projects = projects.filter(p => p.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  renderProjects(projects);
}
