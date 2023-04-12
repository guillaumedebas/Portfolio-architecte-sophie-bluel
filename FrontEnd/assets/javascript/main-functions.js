import {
    generateModalFigures,
    addGalleryListener
} from "./modal-delete-gallery.js";

import {
    objectProjectCreation
} from "./modal-add-project.js";

//To generate the figures in the main-gallery
export const generateFigures = function (figures) {
    const figuresSection = document.querySelector(".main-gallery");
    figuresSection.innerHTML = "";
    for (let i = 0; i < figures.length; i++) {

        const figure = figures[i];

        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = figure.title;

        figuresSection.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
    }
};

//To generate the filter buttons with the database categories
export const filterButtonsCreation = async function (categoriesJson) {
    for (let i in categoriesJson) {
        const filterButton = document.createElement("li");
        filterButton.innerText = categoriesJson[i].name;
        filterButton.id = `filterButton-${categoriesJson[i].id}`;
        filterButton.classList.add("filterButton");
        document.querySelector(".filters").appendChild(filterButton);
    }
};

//To filter the figures in main-gallery with the filter buttons
export const filterFigures = async function (e, previousFilterButton) {
    const target = e.currentTarget;
    const categoryId = target.id.split('-')[1];
    const figures = await fetchType("works");

    const filterFigures = figures.filter(function (figure) {
        // Use 0 for all category
        if (categoryId == 0) {
            return figure
        }
        return figure.categoryId == categoryId;
    });
    generateFigures(filterFigures);

    previousFilterButton = filterSelectManage(target, previousFilterButton);
    return previousFilterButton;
};

//To manage the display of the selected filter button
export const filterSelectManage = function (target, previousFilterButton) {
    if (target) {
        const filterButton = document.querySelector(`#${target.id}`);
        previousFilterButton.classList.remove('selectFilter');
        filterButton.classList.add('selectFilter');
        previousFilterButton = filterButton;
    } else {
        previousFilterButton = document.querySelector("#filterButton-0");
        previousFilterButton.classList.add("selectFilter");
    }
    return previousFilterButton;
};

//To manage the different fetches 
export const fetchType = async function (type) {
    const path = "http://localhost:5678/api/"
    //type : categories or works --> Returns all categories or works
    //type : use with a click event --> Delete a work depending on id
    //type : sendProject --> Send a new work
    //type : login --> Log In the user

    if (type == "categories" || type == "works") {
        const response = await fetch(path + type);
        const categoriesOrFiguresJson = await response.json();
        return categoriesOrFiguresJson;
    }

    if (type.target) {
        const target = type.target.id;
        const id = target.split('trash-')[1];
        const token = window.localStorage.getItem("token");
        const headers = { 'Authorization': `Bearer ${token}` }
        const response = await fetch(`${path}works/${id}`, {
            method: "DELETE",
            headers: headers
        });
        if (!response.ok) {
            tokkenErrorManage();
        } else {
            generateFigures(await fetchType("works"));
            generateModalFigures(await fetchType("works"));
            addGalleryListener();
        }
    }

    if (type == "sendProject") {
        console.log("sendProject")
        const token = window.localStorage.getItem("token");
        const response = await fetch(path + "works", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            },
            body: objectProjectCreation()
        });
        return response;
    }

    if (type == "login") {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch(path + "users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: `{
            "email": "${email}",
            "password": "${password}"
          }`
        });
        return response.json();
    }
};