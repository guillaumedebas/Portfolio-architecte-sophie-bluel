const path = "http://localhost:5678/api/"

import {
    addProject
} from "./modal-add-project.js";

import {
    fetchType
} from "./main-functions.js";

//To generate the figures in the modal-gallery with the delete icons
export function generateModalFigures(figures) {
    document.querySelector(".modal-gallery").innerHTML = "";
    for (let i = 0; i < figures.length; i++) {

        const figure = figures[i];

        const figuresSection = document.querySelector(".modal-gallery");

        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;
        const iTrashElement = document.createElement("i");
        iTrashElement.className = 'fa-solid fa-trash-can js-delete';
        iTrashElement.id = `trash-${figure.id} `;
        const iEditionElement = document.createElement("i");
        iEditionElement.className = 'fa-solid fa-arrows-up-down-left-right';
        iEditionElement.id = `edition-${figure.id}`;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = "éditer";

        figuresSection.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(iTrashElement);
        figureElement.appendChild(iEditionElement);
        figureElement.appendChild(figcaptionElement);

    }
}

//To add the listeners to the modal-gallery
export const addGalleryListener = function () {
    modal.querySelector('.to-add-project').addEventListener('click', addProject);
    modal.querySelectorAll('.js-delete').forEach(i => {
        i.addEventListener('click', fetchType);
    });
}