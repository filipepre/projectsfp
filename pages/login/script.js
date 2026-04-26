function saveToken() {
    const token = document.getElementById("token").value.trim();
    const BASE_URL = location.pathname.startsWith("/projectsfp") ? "/projectsfp" : "";

    if (!token) {
        alert("Insere um token");
        return;
    }

    localStorage.setItem("github_token", token);

    document.getElementById("msg").innerText = "Token guardado!";

    setTimeout(() => {
        window.location.href = BASE_URL + "/pages/admin/index.html";
    }, 1000);
}