const form = document.querySelector(".form");
    form.addEventListener("submit", async function () {
    event.preventDefault()
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:  `{
            "email": "${email}",
            "password": "${password}"
          }`
    });
    const validation = await reponse.json();


    if (validation.userId && validation.token) {
        window.localStorage.setItem("userId", validation.userId);
        window.localStorage.setItem("token", validation.token);
        console.log("Accès ok");
        location.href = "index.html";
    } else {
        console.log("erreur !");
        const errorPlace = document.querySelector(".error");
        const errorElement = document.createElement("p");
        errorElement.innerText = "Erreur d'identification";

        errorPlace.appendChild(errorElement);


    }

    });
