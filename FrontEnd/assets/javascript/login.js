const formLogin = document.querySelector(".form-login");
const errorElement = document.createElement("p");
const errorPlace = document.querySelector(".error-place");

import {
    loginActivate
} from "./login-functions.js";

import {
    fetchType
} from "./main-functions.js";

if (window.localStorage.getItem("tokkenError")) {
    errorElement.innerText = window.localStorage.getItem("tokkenError");
}
formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();
    const validation = await fetchType("login");


    if (validation.token) {

        loginActivate(validation.token);

    } else {

        errorElement.innerText = "Erreur dans l’identifiant ou le mot de passe";
    }

});
errorPlace.appendChild(errorElement);