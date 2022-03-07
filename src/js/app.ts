import axios from "axios";

let dogBreedResponse: { message };
let dogBreedList: { name: string, value: string }[] = [];

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
                link.addEventListener('click', route);
                li.appendChild(link);
                ulList.appendChild(li);
            });
        })
        .catch(err => {
            console.log(err);
        })
}

function fetchBreed(dogBreed: string) {
    console.log(dogBreed);
}

function route() {
    const urlHash = window.location.hash;
    let [key, value] = urlHash.split('=');

    switch (key) {
        case '#bred-nav':
    }
}

fetchBreedList();
route();
