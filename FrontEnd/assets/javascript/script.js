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



