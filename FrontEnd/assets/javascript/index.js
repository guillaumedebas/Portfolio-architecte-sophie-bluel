const reponse = await fetch("http://localhost:5678/api/works");
const figures = await reponse.json();



function generateFigures(figures) {
    for (let i = 0; i < figures.length; i++) {

        const figure = figures[i];

        const figuresSection = document.querySelector(".gallery");

        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = figure.title;

        figuresSection.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);

    }
}
// Use 0 for all category
function filterButtons (className, categoryId) {
   const filterButton = document.querySelector(`.${className}`);
    filterButton.addEventListener("click", function () {
    const filtredFigures = figures.filter(function (figure) {
        if (categoryId != 0) {
        return figure.categoryId == categoryId;
        }
        return figure.categoryId
    });
    document.querySelector(".gallery").innerHTML = "";
    generateFigures(filtredFigures);
});
};

generateFigures(figures);

filterButtons("tous", 0);
filterButtons("objets", 1);
filterButtons("appartements", 2);
filterButtons("hotels-restaurants", 3);
const logLink = document.querySelector(".logLink")
const creationSection = document.querySelector("#creation")
const modifyPart = document.querySelector(".modify")
const modifyPartProjet = document.querySelector(".modifyProjet")
if (window.localStorage.getItem("userId") && window.localStorage.getItem("token")) {
    console.log("Accès ok");
    logLink.innerText = "logout";
    creationSection.style.display = 'flex';
    modifyPart.style.display = 'flex';
    modifyPartProjet.style.display = 'flex';
 

  } else {
    console.log("erreur !");
    logLink.innerText = "login";
}
const logButton = document.querySelector(`.logLink`);
    logButton.addEventListener("click", function () {
    if (logLink.innerText  == "logout") {
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("token");
        location.href = "index.html";
    } else {
        location.href = "login.html"
    }
});


