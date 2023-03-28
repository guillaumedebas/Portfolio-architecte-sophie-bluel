const form = document.querySelector(".form");
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


    if (validation.userId && validation.token) {
        window.localStorage.setItem("userId", validation.userId);
        window.localStorage.setItem("token", validation.token);
        console.log("Accès ok");
        location.href = "index.html";
    } else {
        console.log("erreur !");
        const errorPlace = document.querySelector(".error");
        const errorElement = document.createElement("p");
        errorElement.innerText = "Erreur dans l’identifiant ou le mot de passe";

        errorPlace.appendChild(errorElement);


    }

    });
