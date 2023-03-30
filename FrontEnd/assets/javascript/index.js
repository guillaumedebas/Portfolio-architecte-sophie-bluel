const response = await fetch("http://localhost:5678/api/works");
let figures = await response.json();
const responseCategory = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategory.json();


function generateFigures(figures) {
    const figuresSection = document.querySelector(".gallery");
    figuresSection.innerHTML = "";
    for (let i = 0; i < figures.length; i++) {

        const figure = figures[i];


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

const figuresInit = async function () {
    const response = await fetch("http://localhost:5678/api/works");
    figures = await response.json();
}

function generateModalFigures(figures) {
    document.querySelector(".modal-gallery").innerHTML = "";
    document.querySelector(".modal-option").innerHTML = "";
    for (let i = 0; i < figures.length; i++) {

        const figure = figures[i];

        const figuresSection = document.querySelector(".modal-gallery");

        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
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
    const optionSection = document.querySelector(".modal-option");
    const aBoutonElement = document.createElement("a");
    aBoutonElement.className = "submit";
    aBoutonElement.innerText = "Ajouter une photo"
    aBoutonElement.href = "modal-photo.html#wrapper-add-photo";
    const aDeleteElement = document.createElement("a");
    aDeleteElement.href = "#";
    aDeleteElement.innerText = "Supprimer la galerie"

    optionSection.appendChild(aBoutonElement);
    optionSection.appendChild(aDeleteElement);
}


// Use 0 for all category
function filterButtons(className, categoryId) {
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
const titleModifyProjet = document.querySelector(".title")
if (window.localStorage.getItem("token")) {
    logLink.innerText = "logout";
    creationSection.style.display = 'flex';
    modifyPart.style.display = 'flex';
    titleModifyProjet.style.display = 'flex';


} else {
    logLink.innerText = "login";

}
const logButton = document.querySelector(`.logLink`);
logButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (logLink.innerText == "logout") {
        window.localStorage.removeItem("token");
        location.href = "index.html";
    } else {
        location.href = e.target.href;
    }
});

let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusableElements = [];
let previouslyFocusedElement = null;

const openModal = async function (e) {
    e.preventDefault();
    const target = e.currentTarget.href;
    modal = await loadModal(target);
    modal.className = "modal";
    focusableElements = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    modal.style.display = "flex";
    generateModalFigures(figures);
    modal.querySelectorAll('.js-delete').forEach(i => {
        i.addEventListener('click', deleteWork);
    });
    modal.addEventListener('click', closeModal);
    modal.querySelector('.submit').addEventListener('click', addProject);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

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

const loadModal = async function (url) {
    const target = '#' + url.split('#')[1];
    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    document.body.append(element);
    return element;
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
})

const deleteWork = async function (e) {
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
    modal.querySelectorAll('.js-delete').forEach(i => {
        i.addEventListener('click', deleteWork);
    });
    modal.querySelector('.submit').addEventListener('click', addProject);
    }


};

const addProject = async function (e) {
    e.preventDefault();
    document.querySelector(".modal").innerHTML = "";

    const url = e.currentTarget.href;
    const target = '#' + url.split('#')[1];

    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    document.querySelector(".modal").append(element);
    document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    document.querySelector('.js-modal-close').addEventListener('click', closeModal);


    let modal = document.querySelector(".modal-wrapper-photo");
    let input = modal.querySelector('.js-insert-image');
    let returnButton = modal.querySelector('.js-modal-return');
    let insertImage = modal.querySelector('.insert-image');
    let insertButton = modal.querySelector('.submit-image');
    input.style.display = "none";
    let objectProject = new FormData();


    const checkValue = function (e) {
        let thisInput = document.getElementById(e.target.id);

        if (thisInput && thisInput.value) {
            if (e.target.id == 'title') {
                objectProject.append('title', thisInput.value);
            }
            if (e.target.id == 'category') {
                objectProject.append('category', thisInput.value);
            }
            if (objectProject.get("image") && objectProject.get("title") && objectProject.get("category")) {
                insertButton.style.background = '#1D6154';
                insertButton.style.cursor = 'pointer';
            }

        }
    }

    function updateImageDisplay() {
        let currentFile = input.files[0];

        if (currentFile && validFileType(currentFile)) {
            insertImage.innerHTML = ""
            let image = document.createElement('img');
            image.src = window.URL.createObjectURL(currentFile);
            objectProject.append('image', currentFile);
            insertImage.appendChild(image);
        } else {
            let paragraph = document.createElement('p');
            paragraph.textContent = 'Veuillez sélectionner un fichier image valide.';
            insertImage.appendChild(paragraph);
        }
        if (objectProject.get("image") && objectProject.get("title") && objectProject.get("category")) {
            insertButton.style.background = '#1D6154';
            insertButton.style.cursor = 'pointer';
        }
    }

    const sendProject = async function (e) {
        e.preventDefault();
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
        document.querySelectorAll('.js-input-form').forEach(input => {
            input.value = "";
        });
        await figuresInit();
        generateFigures(figures);
        document.querySelector(".modal").innerHTML = "";

        const html = await fetch(url).then(response => response.text());
        const element = document.createRange().createContextualFragment(html).querySelector(target);
        document.querySelector(".modal").append(element);
        document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
        document.querySelector('.js-modal-close').addEventListener('click', closeModal);
        modal = document.querySelector(".modal-wrapper-photo");
        input = modal.querySelector('.js-insert-image');
        returnButton = modal.querySelector('.js-modal-return');
        insertImage = modal.querySelector('.insert-image');
        insertButton = modal.querySelector('.submit-image');
        input.style.display = "none";
        input.addEventListener('change', updateImageDisplay);
        returnButton.addEventListener('click', returnModal);
        for (let i in categories) {
            const selectItems = document.querySelector('.js-form-select');
            const selectOption = document.createElement("option");
            selectOption.value = categories[i].id;
            selectOption.innerText = categories[i].name;
            selectItems.appendChild(selectOption);
        }
        insertButton.addEventListener("click", sendProject);
        while (objectProject.keys().next().value) {
            objectProject.delete(objectProject.keys().next().value);
        }
         document.querySelectorAll('.js-input-form').forEach(input => {
            input.addEventListener('change', checkValue);
        })
        };


    };

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





    const returnModal = async function (e) {
        e.preventDefault();
        const url = e.currentTarget.href;
        const target = '#' + url.split('#')[1];
        document.querySelector(".modal").innerHTML = "";

        const html = await fetch(url).then(response => response.text());
        const element = document.createRange().createContextualFragment(html).querySelector(target);
        document.querySelector(".modal").append(element);
        generateModalFigures(figures);
        document.querySelector('.submit').addEventListener('click', addProject);
        document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
        document.querySelector('.js-modal-close').addEventListener('click', closeModal);
        document.querySelectorAll('.js-delete').forEach(i => {
            i.addEventListener('click', deleteWork);
        });

    }

    for (let i in categories) {
        const selectItems = document.querySelector('.js-form-select');
        const selectOption = document.createElement("option");
        selectOption.value = categories[i].id;
        selectOption.innerText = categories[i].name;
        selectItems.appendChild(selectOption);
    }

    document.querySelectorAll('.js-input-form').forEach(input => {
        input.value = "";
    });

    input.addEventListener('change', updateImageDisplay);

    returnButton.addEventListener('click', returnModal);

    insertButton.addEventListener("click", sendProject);

    document.querySelectorAll('.js-input-form').forEach(input => {
        input.addEventListener('change', checkValue);
    });



}












