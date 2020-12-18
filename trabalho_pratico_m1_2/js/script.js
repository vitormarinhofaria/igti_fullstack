window.addEventListener("load", start);

let peopleList = [];
let filteredList = [];

let maleGenderCount = 0;
let femaleGenderCount = 0;
let ageSum = 0;
let ageMed = 0;

let searchInput = null;
let searchButton = null;
let usersList = null;
let statsBoard = null;

function start() {
  searchInput = document.querySelector("#searchInput");
  searchButton = document.querySelector("#searchButton");
  usersList = document.querySelector("#usersList");
  statsBoard = document.querySelector("#statsBoard");

  searchInput.disabled = true;
  searchButton.disabled = true;
  getApiData().then(() => (searchInput.disabled = false));

  searchButton.addEventListener("click", searchButtonClicked);
  searchInput.addEventListener("keyup", searchInputKeyUp);
}

async function getApiData() {
  const result = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const resultJson = await result.json();

  peopleList = resultJson.results.map((person) => {
    const { name, gender, dob, picture } = person;
    return {
      name: `${name.first} ${name.last}`,
      gender,
      age: dob.age,
      picture: picture.thumbnail,
    };
  });
}

function searchInputKeyUp(event) {
  if (searchInput.value.length === 0) {
    searchButton.disabled = true;
  } else {
    searchButton.disabled = false;
  }
  if (event.key === "Enter") {
    filterUsers(searchInput.value);
  }
}

function searchButtonClicked(event) {
  filterUsers(searchInput.value);
}

function filterUsers(filterString) {
  let emptySearch = false;
  if (filterString === "" || filterString === " ") {
    emptySearch = true;
  }
  filterString = filterString.toLowerCase();
  console.log(`Filtering by string: ${filterString}`);

  filteredList = peopleList
    .filter((person) => {
      return person.name.toLowerCase().includes(filterString);
    })
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  console.log(filteredList);
  renderUsersList(emptySearch);
  getStats(emptySearch);
}

function renderUsersList(emptySearch) {
  if (emptySearch === true) {
    usersList.innerHTML = "<h2>Nenhum usuário filtrado</h2>";
    searchInput.value = "";
    return;
  }
  if (filteredList.length !== 0) {
    console.log("Renderizando");

    let html = `<h2>${filteredList.length} usuário(s) encontrado(s)</h2>`;

    filteredList.map((user) => {
      let htmlString = `<div class="person-card">
        <img src="${user.picture}" class="profile-img"/>
        <span>${user.name}, ${user.age} anos</span>
      </div>`;

      html += htmlString;
    });

    usersList.innerHTML = html;
    return;
  }

  let html = "<h2>Busca não retornou resultados</h2>";
  usersList.innerHTML = html;
}

function getStats(emptySearch) {
  ageSum = filteredList.reduce((acc, curr) => {
    return acc + curr.age;
  }, 0);
  ageMed = Intl.NumberFormat("pt-BR").format(ageSum / filteredList.length);
  maleGenderCount = filteredList.reduce((acc, curr) => {
    if (curr.gender === "male") {
      return ++acc;
    } else {
      return acc;
    }
  }, 0);
  femaleGenderCount = filteredList.reduce((acc, curr) => {
    if (curr.gender === "female") {
      return ++acc;
    } else {
      return acc;
    }
  }, 0);
  renderStatsBoard(emptySearch);
}

function renderStatsBoard(emptySearch) {
  if (emptySearch === true || filteredList.length === 0) {
    statsBoard.innerHTML = "<h2>Nada a ser exibido</h2>";
    return;
  }
  let html = `
    <h2>Estatísticas</h2>
    <p>Sexo masculino: <b>${maleGenderCount}</b></p>
    <p>Sexo feminino: <b>${femaleGenderCount}</b></p>
    <p>Soma das idades: <b>${ageSum}</b></p>
    <p>Média das idades: <b>${ageMed}</b></p>
  `;

  statsBoard.innerHTML = html;
}
