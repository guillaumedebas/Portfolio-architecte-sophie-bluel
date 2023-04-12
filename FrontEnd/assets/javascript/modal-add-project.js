const path = "http://localhost:5678/api/"

import {
    generateFigures,
    fetchType
} from "./main-functions.js";

import {
    loadModal,
    initModalManage
} from "./modal-manage-functions.js";

import {
    generateModalFigures,
    addGalleryListener
} from "./modal-delete-gallery.js";

export const addProject = async function (e) {
    e.preventDefault();
    await initModal(e);
    await initAddProject();
    initModalManage();
};

import {
    tokkenErrorManage
} from "./login-functions.js";

//To initialize a new page in the modal
const initModal = async function (e) {
    const modal = document.querySelector(".modal");
    modal.innerHTML = "";
    const url = e.currentTarget.href;
    const element = await loadModal(url);
    modal.append(element);
};

////To add the listeners for add-project page
const initAddProject = async function () {
    const input = modal.querySelector('.js-input-image');
    const returnButton = modal.querySelector('.js-modal-return');
    initCategory(await fetchType("categories"));
    modal.querySelectorAll('.js-input-form').forEach(input => {
        input.value = "";
    });
    returnButton.addEventListener('click', returnModal);
    input.addEventListener('change', updateImageDisplay);
    const submitButton = modal.querySelector('.submit-project');
    submitButton.addEventListener("click", sendProjectManage);
    modal.querySelectorAll('.js-input-form').forEach(input => {
        input.addEventListener('change', checkValue);
    });
    modal.querySelector('.js-input-title').addEventListener("keyup", checkValue);
};

//To initialize the form's category field
const initCategory = async function (categoriesJson) {
    for (let i in categoriesJson) {
        const selectItems = document.querySelector('.js-form-select');
        const selectOption = document.createElement("option");
        selectOption.value = categoriesJson[i].id;
        selectOption.innerText = categoriesJson[i].name;
        selectItems.appendChild(selectOption);
    }
};

//To manage the return to first modal page
const returnModal = async function (e) {
    e.preventDefault();
    await initModal(e);
    generateModalFigures(await fetchType("works"));
    addGalleryListener();
    initModalManage();
};

//To add the uploaded picture to the form preview
const updateImageDisplay = function () {
    const input = modal.querySelector('.js-input-image');
    const warningParagraph = modal.querySelector(".warning-paragraph");
    const currentFile = input.files[0];

    if (currentFile.size > 4194304) {
        warningParagraph.textContent = "Image trop volumineuse. Sélectionner une image de taille inférieure à 4 Mo.";
    } else if (!(currentFile && validFileType(currentFile))) {
        warningParagraph.textContent = 'Veuillez sélectionner un fichier image valide.';
    } else {
        addPreview(currentFile);
    }
};

//To add the picture upload
const addPreview = function (currentFile) {
    const hideableFields = modal.querySelectorAll(".hideable-field");
    hideableFields.forEach(field => {
        field.classList.add('invisible');
    });
    const previewImage = document.createElement('img');
    previewImage.src = window.URL.createObjectURL(currentFile);
    previewImage.className = "preview-image";
    modal.querySelector('.insert-image').appendChild(previewImage);
};

//To manage the project sending
const sendProjectManage = async function (e) {
    e.preventDefault();
    const response = await fetchType("sendProject");
    if (response.ok) {
        refreshAddPhoto();
    } else {
        tokkenErrorManage();
    }
};

//To check the values of the input fields
const checkValue = function (e) {
    let numberValue = 0;
    let numberCompletedValue = 0;
    const submitButton = modal.querySelector(".submit-project");
    document.querySelectorAll('.js-input-form').forEach(input => {
        numberValue++;
        if (input.value != "") {
            numberCompletedValue++;
        }
    });
    if (numberCompletedValue == numberValue) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
};

//To validate the uploaded file format
function validFileType(file) {
    const fileTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
    ]
    for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
};

//To create the formData object used to add a project
export const objectProjectCreation = function () {
    const objectProject = new FormData();
    const input = modal.querySelector('.js-input-image');
    const currentFile = input.files[0];
    const inputTitle = modal.querySelector('#title');
    const inputCategory = modal.querySelector('#category');
    objectProject.append('image', currentFile);
    objectProject.append('title', inputTitle.value);
    objectProject.append('category', inputCategory.value);
    return objectProject;
};

//To refresh add-photo modal page after a project add
const refreshAddPhoto = async function () {
    generateFigures(await fetchType("works"));
    const hideableFields = modal.querySelectorAll(".hideable-field");
    hideableFields.forEach(field => {
        field.classList.remove('invisible');
    });
    modal.querySelectorAll('.js-input-form').forEach(input => {
        input.value = "";
    });
    modal.querySelector(".preview-image").remove();
    const warningParagraph = modal.querySelector(".warning-paragraph");
    warningParagraph.textContent = 'Projet ajouté avec succès.';
    modal.querySelector(".submit-project").disabled = true;
};