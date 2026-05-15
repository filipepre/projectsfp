const STORAGE_KEY = "projects";
let tasks = [];

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

  renderTasks();

  const input = document.getElementById("newTaskInput");
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });
});

// 🎨 Render tarefas
function renderTasks() {
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");

    div.classList.add("task");
    div.classList.add(task.status === 1 ? "concluida" : "pendente");

    let value = task.limit_date;

    if (value && value.includes("/")) {
      const [day, month, year] = value.split("/");
      value = `${year}-${month}-${day}`;
    }

    div.innerHTML = `
      <span>${task.description}</span>
      <input type="date" value="${value}" data-index="${index}">

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

// ➕ Nova tarefa
function addTask() {
  const input = document.getElementById("newTaskInput");
  const text = input.value.trim();

  if (!text) return;

  tasks.push({
    description: text,
    limit_date: new Date().toLocaleDateString(),
    status: 0
  });

  renderTasks();
  input.value = "";
}

// 🔁 Toggle
function toggleTask(index) {
  tasks[index].status = tasks[index].status === 1 ? 0 : 1;
  renderTasks();
}

// ❌ Delete
function deleteTask(index) {
  if (!confirm("Apagar esta tarefa?")) return;

  tasks.splice(index, 1);
  renderTasks();
}

// 💾 Guardar projeto
function save() {
  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const newId = projects.length > 0
    ? Math.max(...projects.map(p => p.id)) + 1
    : 1;

  const rawDate = document.getElementById("limit_date").value;

  let formattedDate = rawDate;
  if (rawDate) {
    const [y, m, d] = rawDate.split("-");
    formattedDate = `${d}/${m}/${y}`;
  }

  const taskInputs = document.querySelectorAll("#taskList input[type='date']");

  const formattedTasks = Array.from(taskInputs).map((input, i) => {
    let raw = input.value;

    if (raw && raw.includes("-")) {
      const [y, m, d] = raw.split("-");
      raw = `${d}/${m}/${y}`;
    }

    return {
      ...tasks[i],
      limit_date: raw
    };
  });

  const newProject = {
    id: newId,
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    creation_date: new Date().toLocaleDateString(),
    limit_date: formattedDate,
    status: 0,
    tasks: formattedTasks
  };

  projects.push(newProject);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  alert("Projeto criado!");
  goBack();
}

// 🔙 Voltar
function goBack() {
  window.location.href = "../index.html";
}