// ///////////////////////////////////////////////Main page
const responseCategory = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategory.json();
let figures = null;
let urlSave = null;
const logLink = document.querySelector(".logLink");
const creationSection = document.querySelector("#creation");
const modifyPart = document.querySelector(".modify");
const titleModifyProject = document.querySelector(".title");
const filtersProject = document.querySelector(".filters");
const initFilterSelectButton = document.querySelector(".tous");
const contactForm = document.querySelector(".contact-form");
let previousFilterButton = initFilterSelectButton;
initFilterSelectButton.style.background = "#1D6154";
initFilterSelectButton.style.color = "white";

const loginVerify = function() {
    if (window.localStorage.getItem("token")) {
        logLink.innerText = "logout";
        creationSection.style.display = 'flex';
        modifyPart.style.display = 'flex';
        titleModifyProject.style.display = 'flex';
        filtersProject.style.display = 'none';
    
    } else {
        logLink.innerText = "login";
    }
};

const logInOut = function(e) {
    e.preventDefault();
    if (logLink.innerText == "logout") {
        window.localStorage.removeItem("token");
        location.href = "index.html";
    } else {
        location.href = e.target.href;
    }
};

const filterButtons = function(className, categoryId) {
    const filterButton = document.querySelector(`.${className}`);
    filterButton.addEventListener("click", function () {
        const filterFigures = figures.filter(function (figure) {
            // Use 0 for all category
            if (categoryId == 0) {
                return figure
            }
            return figure.categoryId == categoryId;
        });
        generateFigures(filterFigures);
      
        previousFilterButton.style.background = "white";
        previousFilterButton.style.color = "#1D6154";
        filterButton.style.background = "#1D6154";
        filterButton.style.color = "white";
        previousFilterButton = filterButton;
    });
};

const figuresInit = async function () {
    const response = await fetch("http://localhost:5678/api/works");
    figures = await response.json();
}

const generateFigures = function(figures) {
    const figuresSection = document.querySelector(".gallery");
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
}

const disable = function(e) {
    e.preventDefault();
}

logLink.addEventListener("click", logInOut);
loginVerify();
await figuresInit();
generateFigures(figures);
filterButtons("tous", 0);
filterButtons("objets", 1);
filterButtons("appartements", 2);
filterButtons("hotels-restaurants", 3);
contactForm.addEventListener("click", disable);


// ///////////////////////////////////////////////Modal System
let modal = null;
const focusableSelector = 'button, a, input, textarea, select';
let focusableElements = [];
let previouslyFocusedElement = null;

const listenKey = function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
};

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusableElements.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    if (index >= focusableElements.length) {
        index = 0;

    }
    if (index < 0) {
        index = focusableElements.length - 1;
    }
    
    focusableElements[index].focus();
}

const addGalleryListener = function () {
    modal.querySelector('.submit').addEventListener('click', addProject);
    modal.querySelectorAll('.js-delete').forEach(i => {
        i.addEventListener('click', deleteProject);
    });
}

const initModalManage = function () {
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    focusableElements = Array.from(modal.querySelectorAll(focusableSelector));
    window.addEventListener('keydown', listenKey);
}

const openModal = async function (e) {
    e.preventDefault();
    const target = e.currentTarget.href;
    modal = await loadModal(target);
    previouslyFocusedElement = document.querySelector(':focus');
    modal.style.display = "flex";
    generateModalFigures(figures);
    addGalleryListener(e);
    initModalManage();
}

const loadModal = async function (url) {
    const target = '#' + url.split('#')[1];
    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    document.body.append(element);
    return element;    
}

const closeModal = function (e) {
    if (modal == null) {
        return;
    }
    if (previouslyFocusedElement !== null) {
        previouslyFocusedElement.focus();
    }
    e.preventDefault();
    modal.className = "modal modal-close";
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    window.removeEventListener('keydown', listenKey);
    const hideModal = function () {
        modal.style.display = "none";
        modal.removeEventListener('animationend', hideModal);
        modal.remove('animationend', hideModal);

    };
    modal.addEventListener('animationend', hideModal);


}

const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

// ///////////////////////////////////////////////Modal Gallery

function generateModalFigures(figures) {
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

const deleteProject= async function (e) {
    const target = e.target.id;
    const id = target.split('trash-')[1];
    const token = window.localStorage.getItem("token");
    const headers = { 'Authorization': `Bearer ${token}` }
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: headers
    });
    if (!response.ok) {
        window.localStorage.removeItem("token");
        location.href = "login.html";
        window.localStorage.setItem("erreurTokken", "Erreur d'authentification, veuillez-vous reconnecter. Si le problème persiste, contactez votre administrateur.");
    } else {
    await figuresInit();
    generateFigures(figures);
    generateModalFigures(figures);
    addGalleryListener();
    }
    };

// ///////////////////////////////////////////////Modal Add Photo

let objectProject = new FormData();

const addProject = async function (e) {
    e.preventDefault();
    await initModal(e);
    await initAddProject(e);
    initModalManage(e);
}

const initModal= async function(e) {
    let modal = document.querySelector(".modal");
    modal.innerHTML = "";
       let url = null;
    if (urlSave == null) {
    url = e.currentTarget.href;
    urlSave = url;
    } else {
        url = urlSave;
    }
    const element = await loadModal(url);
     modal.append(element);
   
}

const initAddProject = async function(e) {
    let input = modal.querySelector('.js-insert-image');
    let returnButton = modal.querySelector('.js-modal-return');
    input.style.opacity = 0;
    initCategory();
    document.querySelectorAll('.js-input-form').forEach(input => {
        input.value = "";
    });
    returnButton.addEventListener('click', returnModal);
    input.addEventListener('change', updateImageDisplay);
    let insertButton = modal.querySelector('.submit-image');  
    insertButton.addEventListener("click", sendProject);
    document.querySelectorAll('.js-input-form').forEach(input => {
        input.addEventListener('change', checkValue);
    });
};

const returnModal = async function (e) {
    urlSave = null;
    e.preventDefault();
    await initModal(e);
    generateModalFigures(figures);
    addGalleryListener(e);
    initModalManage(e);
    urlSave = null;
   }

const initCategory = function () {
    for (let i in categories) {
        const selectItems = document.querySelector('.js-form-select');
        const selectOption = document.createElement("option");
        selectOption.value = categories[i].id;
        selectOption.innerText = categories[i].name;
        selectItems.appendChild(selectOption);
    }
};

const unlockSend = function () {
    let insertButton = modal.querySelector('.submit-image');
    if (objectProject.get("image") && objectProject.get("title") && objectProject.get("category")) {
        insertButton.style.background = '#1D6154';
        insertButton.style.cursor = 'pointer';
    }
}

const checkValue = function (e) {
    let thisInput = document.getElementById(e.target.id);
    if (thisInput && thisInput.value) {
        if (e.target.id == 'title') {
            objectProject.append('title', thisInput.value);
        }
        if (e.target.id == 'category') {
            objectProject.append('category', thisInput.value);
        }
        unlockSend();
    }
}

function updateImageDisplay() {
    let input = modal.querySelector('.js-insert-image');
    let insertImage = modal.querySelector('.insert-image');
    const warningParagraph = modal.querySelector(".error-paragraph");
    let currentFile = input.files[0];
    if (currentFile.size > 4194304) {
        warningParagraph.textContent = "Image trop volumineuse. Sélectionner une image de taille inférieure à 4 Mo.";
    } else if (currentFile && validFileType(currentFile)) {
        insertImage.innerHTML = ""
        let image = document.createElement('img');
        image.src = window.URL.createObjectURL(currentFile);
        objectProject.append('image', currentFile);
        insertImage.appendChild(image);
    } else {
        warningParagraph.textContent = 'Veuillez sélectionner un fichier image valide.';
    }
    unlockSend();
}

let fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
]

function validFileType(file) {
    for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}

const sendProject = async function (e) {
    e.preventDefault();
    if (objectProject.get("image") && objectProject.get("title") && objectProject.get("category")) {
    const token = window.localStorage.getItem("token");
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
        },
        body: objectProject
    });
    if (!response.ok) {
        window.localStorage.removeItem("token");
        location.href = "login.html";
        window.localStorage.setItem("erreurTokken", "Erreur d'authentification, veuillez-vous reconnecter. Si le problème persiste, contactez votre administrateur.");
    } else {
        await figuresInit();
        generateFigures(figures);
        await addProject(e);
        const warningParagraph = modal.querySelector(".error-paragraph");
        warningParagraph.textContent = 'Projet ajouté avec succès.';
        while (objectProject.keys().next().value) {
            objectProject.delete(objectProject.keys().next().value);
    };
    }
    }
    };















