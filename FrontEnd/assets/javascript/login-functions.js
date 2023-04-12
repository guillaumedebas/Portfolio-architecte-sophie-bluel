export const loginActivate = function (validationToken) {
    window.localStorage.setItem("token", validationToken);
    location.href = "index.html";
    window.localStorage.removeItem("tokkenError");
};

//To manage the administrator mode on the main page
export const loginVerify = function () {
    const logLink = document.querySelector(".logLink");
    const filtersProject = document.querySelector(".filters");
    const mountableFields = document.querySelectorAll(".mountable-field");
    if (window.localStorage.getItem("token")) {
        logLink.innerText = "logout";
        mountableFields.forEach(field => {
            field.classList.add('visible');
        });
        filtersProject.classList.add("invisible");
    }
};

//To modify the login statut with the button "login/logout"
export const logInOut = function (e) {
    e.preventDefault();
    const logLink = document.querySelector(".logLink");
    const filtersProject = document.querySelector(".filters");
    const mountableFields = document.querySelectorAll(".mountable-field");
    if (window.localStorage.getItem("token")) {
        window.localStorage.removeItem("token");
        mountableFields.forEach(field => {
            field.classList.remove('visible');
        });
        filtersProject.classList.remove("invisible");
        logLink.innerText = "login";
    } else {
        location.href = e.target.href;
    }
};

//To manage the tokken Error
export const tokkenErrorManage = function () {
    window.localStorage.removeItem("token");
    window.localStorage.setItem("tokkenError", "Erreur d'authentification, veuillez-vous reconnecter. Si le problème persiste, contactez votre administrateur.");
    location.href = "login.html";
};