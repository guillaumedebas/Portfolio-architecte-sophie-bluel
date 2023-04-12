import {
    generateFigures,
    filterButtonsCreation,
    filterFigures,
    fetchType,
    filterSelectManage
} from "./main-functions.js";

import {
    loginVerify,
    logInOut
} from "./login-functions.js";

import {
    openModal,
} from "./modal-manage-functions.js";

let previousFilterButton = filterSelectManage();

document.querySelector('.logLink').addEventListener("click", logInOut);
document.querySelector('.publish').addEventListener("click", logInOut);
loginVerify();
generateFigures(await fetchType("works"));
filterButtonsCreation(await fetchType("categories"));
document.querySelectorAll('.filterButton').forEach(li => {
    li.addEventListener('click', async function (e) {
        previousFilterButton = await filterFigures(e, previousFilterButton);
    });
});
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});