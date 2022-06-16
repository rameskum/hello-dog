import axios from "axios";
import Toastify from 'toastify-js'

let dogBreedResponse: { message };
let dogBreedList: { name: string, value: string }[] = [];
let filteredDogBreedList: { name: string, value: string }[] = [];
let dogImages: string[] = [];
const header = document.querySelector('.page-heading');
const gridContainer = document.querySelector('.grid-container');
const searchBox = document.querySelector('.search');
const loader = document.querySelector('.loader');
const main_content = document.querySelector('.main');

let noResultText = document.createElement('h2');
noResultText.textContent = 'No Result';

function crateBreedList() {
    let ulList = document.querySelector('.left-nav-list');
    ulList.innerHTML = '';
    filteredDogBreedList.forEach(breed => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'left-nav-link';
        link.innerText = breed.name;
        link.href = `#bred-nav=${breed.value}`;
        link.addEventListener('click', () => fetchBreed(breed.value));
        li.appendChild(link);
        ulList.appendChild(li);
    });
}

function fetchBreedList() {
    axios({
            method: 'get',
            url: 'https://dog.ceo/api/breeds/list/all',
            responseType: 'json'
        }
    )
        .then(res => {
            dogBreedResponse = res.data?.message;
        })
        .then(() => {
            for (const property in dogBreedResponse) {
                if (!dogBreedResponse[property] || dogBreedResponse[property].length === 0) {
                    dogBreedList.push({name: property, value: property});
                } else {
                    for (const prop in dogBreedResponse[property]) {
                        dogBreedList.push({
                            name: `${property}-${dogBreedResponse[property][prop]}`,
                            value: `${property}/${dogBreedResponse[property][prop]}`
                        });
                    }
                }
            }
            filteredDogBreedList = dogBreedList;
        })
        .then(() => crateBreedList())
        .then(() => {
            loader.remove();
            main_content.classList.remove('hidden');
        })
        .catch(err => {
            console.log(err);
        })
}

function fetchBreed(dogBreed: string) {
    header.textContent = `Random Images - ${dogBreed.toUpperCase()}`
    axios({
        method: 'get',
        url: `https://dog.ceo/api/breed/${dogBreed}/images/random/15`,
        responseType: 'json'
    })
        .then(res => {
            dogImages = [];
            dogImages = res.data?.message;
        })
        .catch(err => {
            console.log(err);
            dogImages = [];
        })
        .then(loadMainContent);
}

function createImageCard(imgUrl: string, caption?: string) {
    const imgDiv = document.createElement('div');
    const imgTag = document.createElement('img');
    imgDiv.appendChild(imgTag);

    imgTag.className = 'grid-item';
    imgTag.src = imgUrl;

    if (caption) {
        imgTag.alt = caption;
        const pTag = document.createElement('p');
        pTag.innerText = caption;
        imgDiv.appendChild(pTag);
    }

    return imgDiv;
}

function loadMainContent() {
    gridContainer.innerHTML = '';
    if (dogImages.length == 0) {
        gridContainer.appendChild(noResultText);
        return;
    }
    for (let i = 0; i < dogImages.length; i++) {
        let resolvedBreed = dogImages[i]
            .substring(dogImages[i].indexOf('/breeds/'))
            .replace('/breeds/', '');
        resolvedBreed = resolvedBreed.substring(0, resolvedBreed.lastIndexOf('/'));
        let card = createImageCard(dogImages[i], resolvedBreed);
        gridContainer.appendChild(card);
    }
}

function loadRandom() {
    console.log('loading random dog images');
    header.textContent = 'Random Dog Image';

    axios({
        method: 'get',
        url: 'https://dog.ceo/api/breeds/image/random/10',
        responseType: 'json'
    })
        .then(res => {
            dogImages = [];
            dogImages = res.data?.message;
        })
        .then(loadMainContent)
        .catch(err => {
            console.log(err);
        })
}

function route() {
    const urlHash = window.location.hash;
    let [key, value] = urlHash.split('=');

    switch (key) {
        case '#bred-nav':
            console.log('breed-name => ' + value);
            if (!value) {
                console.error('breed value not set!');
                loadRandom();
                break;
            }
            fetchBreed(value);
            break;
        default:
            console.log('route not defined!', 'loading random');
            loadRandom();
            break;
    }
}

function search(e) {
    const searchStr = e.target.value;
    console.log(searchStr)
    if (searchStr) {
        filteredDogBreedList = [];
        for (const breedEl of dogBreedList) {
            if (breedEl.name.match(searchStr)) {
                console.log('match')
                filteredDogBreedList.push(breedEl);
            }
        }
    } else {
        filteredDogBreedList = dogBreedList;
    }
    crateBreedList();
}

function funFacts() {
    let facts: string[] = [];
    let errorCounter = 0;
    let interval = setInterval(() => {
        if (facts.length == 0) {
            if (errorCounter == 5) {
                console.log("multiple errors! giving up.")
                clearInterval(interval);
                return;
            }
            axios.get('https://dog-fact.herokuapp.com/api/v1/facts/dog?count=15')
                .then(res => {
                    facts = res.data.facts || [];
                })
                .then(() => {
                })
                .catch(() => {
                    errorCounter++;
                    console.log('error while getting dogs facts');
                });
        }
        // display toast
        let fact = facts.shift();
        fact && Toastify({
            text: fact,
            duration: 15000,
            close: false,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
    }, 5000);
}

fetchBreedList();
route();
funFacts();

searchBox.addEventListener('input', e => search(e));
