import {fetchAllPlanets, fetchAllPeople, fetchVotesStatistics} from "/static/js/fetch.js";

async function main() {
    let currentPage = 1;
    let resultBeginningSlice = 0;
    let resultEndingSlice = 10;
    let allData = await getAllData();
    let planetsResult = allData[0];
    let peopleResult = allData[1];
    addIdToPlanet(planetsResult);
    localStorage.setItem("people", JSON.stringify(peopleResult));
    fillTableRows(resultBeginningSlice, resultEndingSlice);
    ButtonsEvent(currentPage, resultBeginningSlice, resultEndingSlice);
    showRegistrationModalOnClick();
    showLoginModalOnClick();
    await getAllVotes();
}

main();

function addIdToPlanet(planetsResult) {
    for (let i=0; i<planetsResult.length; i++) {
        planetsResult[i]['id'] = i+1;
    }
    localStorage.setItem("planets", JSON.stringify(planetsResult));
}

function ButtonsEvent(currentPage, resultBeginningSlice, resultEndingSlice) {
    let buttonNextPage = document.getElementById('btn-next');
    let buttonPreviousPage = document.getElementById('btn-previous');

    buttonNextPage.addEventListener('click', function (event) {
        currentPage += 1;
        let planetsResult = localStorage.getItem("planets");
        resultBeginningSlice += 10;
        resultEndingSlice += 10;
        if (resultEndingSlice >= planetsResult.length) {
            resultEndingSlice = planetsResult.length;
        }
        checkCurrentPageForPagination(currentPage, buttonNextPage, buttonPreviousPage);
        fillTableRows(resultBeginningSlice, resultEndingSlice);
    });

    buttonPreviousPage.addEventListener('click', function (event) {
        currentPage -= 1;
        resultBeginningSlice -= 10;
        resultEndingSlice -= 10;
        if (resultBeginningSlice <= 0) {
            resultBeginningSlice = 0;
        }
        checkCurrentPageForPagination(currentPage, buttonNextPage, buttonPreviousPage);

        fillTableRows(resultBeginningSlice, resultEndingSlice);
    });
}

function checkCurrentPageForPagination(currentPage, buttonNextPage, buttonPreviousPage) {
    let firstPage = 1;
    let lastPage = 7;
    if (currentPage === lastPage) {
        buttonNextPage.disabled = true;
    } else {
        buttonNextPage.disabled = false;
    }
    if (currentPage === firstPage) {
        buttonPreviousPage.disabled = true;
    } else {
        buttonPreviousPage.disabled = false;
    }
}

function fillTableRows(beginning, end) {
    let row = document.getElementById('planets');
    row.innerHTML = '';
    let planetsResult = localStorage.getItem("planets");
    planetsResult = JSON.parse(planetsResult);
    planetsResult = planetsResult.slice(beginning, end);
    addPlanetsToRows(planetsResult, row);
    showResidentsOfPlanet();
}

async function getAllData() {
    let planetsResult = await fetchAllPlanets();
    let peopleResult = await fetchAllPeople();
    return [planetsResult, peopleResult];
}

function addPlanetsToRows(planetsResult, row) {
    for (let planet of planetsResult) {
        let tr = document.createElement('tr');
        tr.setAttribute('id', `${planet.name}`);
        // console.log(planet);
        fillTableDataWithText(planet, tr);
        row.appendChild(tr);
    }
    addEventToVoteButtons();
}

function createNewTableData(data, tr) {
    let td = document.createElement('td');
    td.innerHTML = data;
    tr.appendChild(td);
}

function fillTableDataWithText(planet, tr) {
    createNewTableData(planet.name, tr);
    createNewTableData(planet.diameter, tr);
    createNewTableData(planet.climate, tr);
    createNewTableData(planet.terrain, tr);
    createNewTableDataSurfaceWater(planet.surface_water, tr);
    createNewTableDataPopulation(planet.population, tr);
    createResidentsTableData(planet.residents, tr, planet.name);
    let sessionUsername = document.getElementById('login-modal').dataset.username;
    if (sessionUsername) {
        createVoteButton(tr, planet);
    }
}

function createResidentsTableData(planetResidents, tr, planetName) {
    let td = document.createElement('td');
    let numberOfResidents = planetResidents.length;
    if (numberOfResidents > 0) {
        createResidentsButton(td, numberOfResidents, planetName);
    } else {
        td.innerHTML = 'No known residents';
    }
    tr.appendChild(td);
}


function createResidentsButton(td, numberOfResidents, planetName) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.className = 'resident-button btn btn-light';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
    button.setAttribute('data-planet-name', `${planetName}`);
    button.innerHTML = `${numberOfResidents} resident(s)`;
    td.appendChild(button);
}

function showResidentsOfPlanet() {
    let AllResidentsButton = document.getElementsByClassName('resident-button');
    for (let residentButton of AllResidentsButton) {
        addClickEventForEveryResidentButton(residentButton);
    }
}

function addModalTitle(planetName) {
    let modalTitle = document.getElementsByClassName('modal-title')[0];
    modalTitle.innerHTML = `Residents of ${planetName}`;
}

function addClickEventForEveryResidentButton(residentButton) {
    let planetsPosition = 0;
    residentButton.addEventListener('click', function (event) {
        let modalTableBody = getModalTableBody();
        modalTableBody.innerHTML = '';
        let currentPlanetName = residentButton.dataset.planetName;
        addModalTitle(currentPlanetName);
        let PlanetAndPeopleData = getDataFromLocalStorage();
        for (let planet of PlanetAndPeopleData[planetsPosition]) {
            searchForResidentsOfCurrentPlanet(currentPlanetName, planet, PlanetAndPeopleData)
        }
    })
}

function searchForResidentsOfCurrentPlanet(currentPlanetName, planet, PlanetAndPeopleData) {
    let peoplePosition = 1;
    if (currentPlanetName === planet.name) {
        let planetResidents = planet.residents;
        for (let person of PlanetAndPeopleData[peoplePosition]) {
            checkIfPersonAmongResidents(person, planetResidents)
        }
    }
}

function checkIfPersonAmongResidents(person, planetResidents) {
    if (planetResidents.includes(person.url)) {
        fillModalWithData(person);
    }
}

function getDataFromLocalStorage() {
    let planetResult = localStorage.getItem('planets');
    planetResult = JSON.parse(planetResult);
    let peopleResult = localStorage.getItem('people');
    peopleResult = JSON.parse(peopleResult);
    return [planetResult, peopleResult]
}

function fillModalWithData(person) {
    let modalTableBody = getModalTableBody();
    let tr = document.createElement('tr');
    createNewTableData(person.name, tr);
    createNewTableData(person.height, tr);
    createNewTableData(person.mass, tr);
    createNewTableData(person.hair_color, tr);
    createNewTableData(person.skin_color, tr);
    createNewTableData(person.eye_color, tr);
    createNewTableData(person.birth_year, tr);
    createNewTableData(person.gender, tr);
    modalTableBody.appendChild(tr);
}

function getModalTableBody() {
    return document.getElementById('people');
}

function createNewTableDataSurfaceWater(data, tr) {
    let td = document.createElement('td');
    if (data === 'unknown'){
        td.innerHTML = data;
    } else {
        td.innerHTML = `${data}%`;
    }
    tr.appendChild(td);
}

function createNewTableDataPopulation(data, tr) {
    let td = document.createElement('td');
    if (data === 'unknown'){
        td.innerHTML = data;
    } else {
        data = parseInt(data);
        td.innerHTML = `${data.toLocaleString()} people`;
    }
    tr.appendChild(td);
}

function createVoteButton(tr, planet) {
    let td = document.createElement('td');
    let form = createVoteForm();
    let input = createInput('planet-id', planet.id);
    let second_input = createInput('planet-name', planet.name);
    let button = createSubmitVoteButton();
    form.appendChild(input);
    form.appendChild(second_input);
    form.appendChild(button);
    td.appendChild(form);
    tr.appendChild(td);
}

function createSubmitVoteButton() {
    let button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.className = 'vote-button btn btn-light';
    button.innerHTML = 'Vote';
    return button;
}

function createVoteForm() {
    let form = document.createElement('form');
    form.setAttribute('action', '/vote');
    form.setAttribute('method', 'post');
    return form;
}

function createInput(name, data) {
    let input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', `${name}`);
    input.setAttribute('value', `${data}`);
    return input;
}

function showRegistrationModalOnClick() {
    let registerButton = document.getElementById('registration');
    let registrationModal = document.getElementById('registration-modal');
    let registrationCloseButton = document.getElementById('register-close');
    registerButton.addEventListener('click', function (event) {
        registrationModal.style.display = 'block';
        closeModal(registrationModal, registrationCloseButton);
    })
}

function closeModal(modal, button) {
    button.addEventListener('click', function () {
        modal.style.display = 'none';
    })
}

function showLoginModalOnClick() {
    let loginModal = document.getElementById('login-modal');
    let loginButton = document.getElementById('login');
    let loginCloseButton = document.getElementById('login-close');
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            loginModal.style.display = 'block';
            closeModal(loginModal, loginCloseButton);
        })
    }
}

function addEventToVoteButtons() {
    let voteButtons = document.getElementsByClassName('vote-button');
    for (let voteButton of voteButtons) {
        voteButton.addEventListener('click', function (event) {
            alert('Your vote is saved');
        })
    }
}

async function getAllVotes() {
    let stats = await fetchVotesStatistics();
    let tableBody = document.getElementById('stats');
    fillStatsModalWithData(stats, tableBody);
}

function fillStatsModalWithData(stats, tableBody) {
    for (let stat of stats) {
        let tr = document.createElement('tr');
        createNewTableData(stat['planet_name'], tr);
        createNewTableData(stat['count'], tr);
        tableBody.appendChild(tr);
    }
}