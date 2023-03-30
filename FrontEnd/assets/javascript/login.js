const form = document.querySelector(".form");
const errorElement = document.createElement("p");
const errorPlace = document.querySelector(".error");
if (window.localStorage.getItem("erreurTokken")) {
    errorElement.innerText = window.localStorage.getItem("erreurTokken");
}
    form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:  `{
            "email": "${email}",
            "password": "${password}"
          }`
    });
    const validation = await response.json();


    if (validation.token) {
        window.localStorage.setItem("token", validation.token);
        location.href = "index.html";
        window.localStorage.removeItem("erreurTokken");
    } else {
        
        errorElement.innerText = "Erreur dans l’identifiant ou le mot de passe";

       


    }

    });
    errorPlace.appendChild(errorElement);