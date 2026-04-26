(async function () {

    const page = window.location.pathname;
    const BASE_URL = location.pathname.startsWith("/projectsfp") ? "/projectsfp" : "";
    const publicPages = [BASE_URL + "/pages/login/index.html"];
    const token = localStorage.getItem("github_token");

    function redirectLogin() {
        localStorage.removeItem("github_token");
        window.location.replace(BASE_URL + "/pages/login/index.html");
    }

    function redirectAdmin() {
        window.location.replace(BASE_URL + "/pages/admin/index.html");
    }

    if (!token) {
        if (!publicPages.includes(page)) {
            redirectLogin();
        }
        return;
    }

    try {
        const res = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            redirectLogin();
            return;
        }

        if (!res.ok) {
            throw new Error("GitHub error");
        }

        const user = await res.json();

        console.log("Token válido:", user.login);

        if (page === BASE_URL + "/pages/login/index.html") {
            redirectAdmin();
            return;
        }

        document.body.style.display = "block";

    } catch (error) {
        redirectLogin();
    }

})();