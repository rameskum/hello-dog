import axios from "axios";

let dogBreedResponse: { message };
let dogBreedList: { name: string, value: string }[] = [];
let dogImages: string[] = [];
const header = document.querySelector('.page-heading');
const gridContainer = document.querySelector('.grid-container');

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
        })
        .then(() => {
            let ulList = document.querySelector('.left-nav-list');
            dogBreedList.forEach(breed => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.className = 'left-nav-link';
                link.innerText = breed.name;
                link.href = `#bred-nav=${breed.value}`;
                link.addEventListener('click', () => fetchBreed(breed.value));
                li.appendChild(link);
                ulList.appendChild(li);
            });
        })
        .catch(err => {
            console.log(err);
        })
}

function fetchBreed(dogBreed: string) {
    header.textContent = `Random Images - ${dogBreed.toUpperCase()}`
    axios({
        method: 'get',
        url: `https://dog.ceo/api/breed/${dogBreed}/images/random/10`,
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
    for (let i = 0; i < dogImages.length; i++) {
        let card = createImageCard(dogImages[i], 'hello');
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
            fetchBreed(value);
            break;
        default:
            console.log('route not defined!', 'loading random');
            loadRandom();
            break;
    }
}

fetchBreedList();
route();
