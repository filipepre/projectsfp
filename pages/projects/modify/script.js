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

  loadProject(); // 🔥 carregar dados depois dos componentes
});

const STORAGE_KEY = "projects";
let tasks = []; // 🔥 global

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

  // converter data para input[type=date]
  if (project.limit_date && project.limit_date.includes("/")) {
    const [day, month, year] = project.limit_date.split("/");
    document.getElementById("limit_date").value = `${year}-${month}-${day}`;
  } else {
    document.getElementById("limit_date").value = project.limit_date;
  }

  // 🔥 carregar tarefas
  tasks = project.tasks || [];

  renderTasks();
}

// 🎨 renderizar tarefas
function renderTasks() {
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");

    div.classList.add("task");
    div.classList.add(task.status === 1 ? "concluida" : "pendente");

    // converter data para input[type=date]
    if (task.limit_date && task.limit_date.includes("/")) {
      const [day, month, year] = task.limit_date.split("/");
      var value = `${year}-${month}-${day}`;
    } else {
      var value = task.limit_date;
    }

    div.innerHTML = `
      <span>${task.description}</span>
      <input id="task_limit_date" type="date" value="${value}" data-index="${index}"></input>

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

// ➕ adicionar tarefa
function addTask() {
  const input = document.getElementById("newTaskInput");
  const text = input.value.trim();

  if (!text) return;

  const novaTarefa = {
    description: text,
    limit_date: new Date().toLocaleDateString(),
    status: 0
  };

  tasks.push(novaTarefa);

  saveTasks();
  renderTasks();

  input.value = "";
}

// 💾 guardar tarefas no projeto
function saveTasks() {
  const id = getProjectId();
  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const index = projects.findIndex(p => p.id === id);

  if (index === -1) return;

  projects[index].tasks = tasks;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// 💾 guardar alterações do projeto
function save() {
  const id = getProjectId();
  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    alert("Erro ao atualizar");
    return;
  }

  const rawDate = document.getElementById("limit_date").value;
  let formattedDate = rawDate;

  if (rawDate) {
    const [year, month, day] = rawDate.split("-");
    formattedDate = `${day}/${month}/${year}`;
  }

  projects[index].name = document.getElementById("name").value;
  projects[index].description = document.getElementById("description").value;
  projects[index].limit_date = formattedDate;

  // 🔥 normalizar tasks
  const taskInputs = document.querySelectorAll("#task_limit_date");

  projects[index].tasks = Array.from(taskInputs).map((input, i) => {
    let raw = input.value;
    let formatted = raw;

    if (raw && raw.includes("-")) {
      const [year, month, day] = raw.split("-");
      formatted = `${day}/${month}/${year}`;
    }

    return {
      ...tasks[i], // mantém resto da task (descrição, status, etc.)
      limit_date: formatted
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  alert("Projeto atualizado!");
  goBack();
}

// 🔙 voltar
function goBack() {
  window.location.href = "../index.html";
}

// ⌨️ ENTER adiciona tarefa
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("newTaskInput");
  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") addTask();
    });
  }
});

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