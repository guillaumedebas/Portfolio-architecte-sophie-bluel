const input = document.querySelector('.js-insert-image');
const insertImage = document.querySelector('.insert-image');
const insertButton = document.querySelector('.submit-image');
const objectProject = new FormData();

const response = await fetch("http://localhost:5678/api/categories");
const categories = await response.json();

input.style.display = "none";


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

insertButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const token = window.localStorage.getItem("token");
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept' : 'application/json'
    },
    body: objectProject
  });
});

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

document.querySelectorAll('.js-input-form').forEach(input => {
  input.addEventListener('change', checkValue);
});

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


