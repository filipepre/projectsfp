const BASE_URL = location.hostname === "filipepre.github.io" ? "/projectsfp" : "";

document.getElementById("home").href = BASE_URL + "/index.html";
document.getElementById("projects").href = BASE_URL + "/pages/projects/index.html";
document.getElementById("information").href = BASE_URL + "/pages/information/index.html";
document.getElementById("admin").href = BASE_URL + "/pages/admin/index.html";