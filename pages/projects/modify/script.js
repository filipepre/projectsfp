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

  loadProject();
});

const STORAGE_KEY = "projects";
let tasks = [];

/* =========================
   DATE HELPERS (DD/MM/YYYY)
========================= */
function toBR(date) {
  if (!date) return "";

  // já está certo
  if (date.includes("/")) return date;

  // ISO -> DD/MM/YYYY
  if (date.includes("-")) {
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }

  return "";
}

function toISO(date) {
  if (!date) return "";

  // DD/MM/YYYY -> ISO
  if (date.includes("/")) {
    const [d, m, y] = date.split("/");
    return `${y}-${m}-${d}`;
  }

  return date;
}

/* =========================
   GET ID
========================= */
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

/* =========================
   LOAD PROJECT
========================= */
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

  document.getElementById("limit_date").value = toISO(project.limit_date);

  tasks = (project.tasks || []).map(t => ({
    ...t,
    limit_date: toBR(t.limit_date)
  }));

  renderTasks();
}

/* =========================
   RENDER
========================= */
function renderTasks() {
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");

    div.classList.add("task");
    div.classList.add(task.status === 1 ? "concluida" : "pendente");

    div.innerHTML = `
      <input class="description-input" type="text" value="${task.description}"
        onchange="updateTask(${index}, 'description', this.value)" />

      <input type="date"
        value="${toISO(task.limit_date)}"
        onchange="updateTaskDate(${index}, this.value)" />

      <div class="task-actions">
        <button onclick="toggleTask(${index})">
          ${task.status === 1 ? "✅" : "❌"}
        </button>

        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;

    container.appendChild(div);
  });
}

/* =========================
   ADD TASK
========================= */
function addTask() {
  const input = document.getElementById("newTaskInput");
  const text = input.value.trim();

  if (!text) return;

  tasks.push({
    description: text,
    limit_date: toBR(new Date().toISOString().split("T")[0]),
    status: 0
  });

  saveTasks();
  renderTasks();
  input.value = "";
}

/* =========================
   SAVE TASKS
========================= */
function saveTasks() {
  const id = getProjectId();
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return;

  projects[index].tasks = tasks.map(t => ({
    ...t,
    limit_date: toBR(t.limit_date)
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/* =========================
   SAVE PROJECT
========================= */
function save() {
  const id = getProjectId();
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    alert("Erro ao atualizar");
    return;
  }

  projects[index].name = document.getElementById("name").value;
  projects[index].description = document.getElementById("description").value;
  projects[index].limit_date = toBR(document.getElementById("limit_date").value);

  projects[index].tasks = tasks.map(t => ({
    ...t,
    limit_date: toBR(t.limit_date)
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  alert("Projeto atualizado!");
  goBack();
}

/* =========================
   TASK OPS
========================= */
function toggleTask(index) {
  tasks[index].status = tasks[index].status === 1 ? 0 : 1;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (!confirm("Apagar esta tarefa?")) return;

  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateTask(index, field, value) {
  tasks[index][field] = value;
  saveTasks();
}

function updateTaskDate(index, value) {
  tasks[index].limit_date = toBR(value);
  saveTasks();
}

/* =========================
   NAV
========================= */
function goBack() {
  window.location.href = "../index.html";
}