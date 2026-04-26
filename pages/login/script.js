function saveToken() {
    const token = document.getElementById("token").value.trim();

    if (!token) {
        alert("Insere um token");
        return;
    }

    localStorage.setItem("github_token", token);

    document.getElementById("msg").innerText = "Token guardado!";

    setTimeout(() => {
        window.location.href = "/pages/admin/index.html";
    }, 1000);
}