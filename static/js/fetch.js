export function fetchAllData(url) {
    let planetsPromise = fetch(url);

    return planetsPromise
            .then(r => r.json())
            .then(data => data)
            .catch(error => {
            console.log(error);
        });
}


export async function fetchAllPlanets() {
    let planets = await fetchAllData('https://swapi.co/api/planets');
    let planetsResult = planets.results;
    let nextPage = planets.next;

    while (nextPage !== null) {
        let nextPageData = await fetchAllData(nextPage);
        nextPage = nextPageData.next;
        let nextPageResults = nextPageData.results;
        planetsResult = planetsResult.concat(nextPageResults);
    }
    return planetsResult;
}

export async function fetchAllPeople() {
    let people = await fetchAllData('https://swapi.co/api/people');
    let peopleResult = people.results;
    let nextPage = people.next;
    while (nextPage !== null) {
        let nextPageData = await fetchAllData(nextPage);
        nextPage = nextPageData.next;
        let nextPageResults = nextPageData.results;
        peopleResult = peopleResult.concat(nextPageResults);
    }
    return peopleResult;
}

export function fetchVotesStatistics() {
    let url = 'http://127.0.0.1:5000/stats';
    let promise = fetch(url);
    return promise
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.log(error);
        });
}