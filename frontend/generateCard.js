const cardHolder = document.getElementById('cardHolder');
const cards = cardHolder.getElementsByClassName('card');

let cardsData = {}

let keywordData = [];
let descriptionData = [];

async function getCards() {
    const url = 'http://127.0.0.1:5000/keyword-abilities';

    try {
        const response = await fetch(url);
        const json = await response.json();

        cardsData = json; //full api data

        cardsData.forEach(card => {
            keywordData.push(card.keyword);
            descriptionData.push(card.description);
        });
    }
    catch (error) {
        console.error(error.message);
    }
}

function makeCards(title, description) {
    // Create a new div element for the card
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('visible');


    const cardTitle = document.createElement('div'); // Create div for title
    cardTitle.classList.add('cardTitle'); ////Give it the class 'cardTitle'
    cardTitle.textContent = title;

    const cardLineBreak = document.createElement('div'); // Create div for the linebreak
    cardLineBreak.classList.add('cardLineBreak'); //Give it the class 'cardLineBreak'

    const cardDescription = document.createElement('div'); // Create div for description
    cardDescription.classList.add('cardDescription'); //Give it the class 'cardDescription'
    cardDescription.textContent = description;

    // Append title, line break, and description to the card
    card.appendChild(cardTitle);
    card.appendChild(cardLineBreak);
    card.appendChild(cardDescription);
    // Return the constructed card element
    return card;
}

async function pushCards() {
    for (let i = 0; i < keywordData.length; i++) {
        const card = makeCards(keywordData[i], descriptionData[i]);
        cardHolder.appendChild(card);
    }
}


(async function initialize() {
    await getCards();
    pushCards();
})();