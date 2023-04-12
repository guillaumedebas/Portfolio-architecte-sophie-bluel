import {
    fetchType,
} from "./main-functions.js";

import {
    generateModalFigures,
    addGalleryListener,
} from "./modal-delete-gallery.js";


let modal = null;
const focusableSelector = 'button, a, input, textarea, select';
let focusableElements = [];
let previouslyFocusedElement = null;

//To listen to keyboard keys when the modal is open
export const listenKey = function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
};

//To manage the focus in the modal
export const focusInModal = function (e) {
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

//To initialize the modal management listener
export const initModalManage = function () {
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    focusableElements = Array.from(modal.querySelectorAll(focusableSelector));
    window.addEventListener('keydown', listenKey);
}

//To manage the opening of the modal based on the clicked link
export const openModal = async function (e) {
    e.preventDefault();
    const target = e.currentTarget.href;
    modal = await loadModal(target);
    previouslyFocusedElement = document.querySelector(':focus');
    generateModalFigures(await fetchType("works"));
    addGalleryListener();
    initModalManage();
};

//To load the desired page in the modal based on the url of the clicked link
export const loadModal = async function (url) {
    const target = '#' + url.split('#')[1];
    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    document.body.append(element);
    return element;
};

//To manage the closing of the modal
export const closeModal = function (e) {
    if (modal == null) {
        return;
    }
    if (previouslyFocusedElement !== null) {
        previouslyFocusedElement.focus();
    }
    e.preventDefault();
    modal.classList.add("modal-close");
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    window.removeEventListener('keydown', listenKey);
    const hideModal = function () {
        modal.removeEventListener('animationend', hideModal);
        modal.remove('animationend', hideModal);

    };
    modal.addEventListener('animationend', hideModal);
}

//To stop the propagation of the click closing the modal
export const stopPropagation = function (e) {
    e.stopPropagation();
}


