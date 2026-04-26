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

async function loadProjects() {
  const BASE_URL = location.pathname.startsWith("/projectsfp") ? "/projectsfp" : "";
  const res = await fetch(BASE_URL + "/data/projects.json");
  const data = await res.json();

  const tbody = document.getElementById("table-body");

  data.forEach(project => {
    const row = document.createElement("tr");

    // Nome
    const nameCell = document.createElement("td");
    nameCell.textContent = project.name;
    row.appendChild(nameCell);

    // Descrição
    const descCell = document.createElement("td");
    descCell.textContent = project.description;
    row.appendChild(descCell);

    // Tarefas
    const taskCell = document.createElement("td");

    taskCell.innerHTML = project.tasks
      .map(task => {
        const status = task.status === 1 ? "✅" : "❌";
        return `${status} ${task.description} - ${task.limit_date}`;
      })
      .join("<br>");

    row.appendChild(taskCell);

    // Data criação
    const creationCell = document.createElement("td");
    creationCell.textContent = project.creation_date;
    row.appendChild(creationCell);

    // Data limite
    const limitCell = document.createElement("td");
    limitCell.textContent = project.limit_date;
    row.appendChild(limitCell);

    // Status
    const statusCell = document.createElement("td");
    statusCell.textContent = project.status === 1 ? "✅" : "❌";
    row.appendChild(statusCell);

    // Modify
    const modifyCell = document.createElement("td");

    const buttonEdit = document.createElement("button");
    buttonEdit.textContent = "✏️";

    const buttonRemove = document.createElement("button");
    buttonRemove.textContent = "🗑️";

    modifyCell.classList.add("action-cell");
    modifyCell.appendChild(buttonEdit);
    modifyCell.appendChild(buttonRemove);
    row.appendChild(modifyCell);

    tbody.appendChild(row);
  });
}

loadProjects();