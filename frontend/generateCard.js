const cardHolder = document.getElementById('cardHolder');
const cards = cardHolder.getElementsByClassName('card');
let cardsData = {}
let keywordData = [];
let descriptionData = [];

// Fetch card data from API
async function fetchCard() {
    const url = 'http://127.0.0.1:5000/keyword-abilities';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        cardsData = json; //Full api data

        // Taking the keyword titles and descriptions
        cardsData.forEach(card => {
            keywordData.push(card.keyword);
            descriptionData.push(card.description);
        });
    }
    catch (error) {
        console.error('Error fetching cards data:', error.message);
    }
}

// Creates a card element with a title, description and a line break between them
function createCard(title, description) {
    // Create a new div element for the card and adds 'card' and 'visible' class
    const card = document.createElement('div');
    card.classList.add('card', 'visible');

    const cardTitle = document.createElement('div'); // Create div for title
    cardTitle.classList.add('cardTitle'); // Give it the class 'cardTitle'
    cardTitle.textContent = title;

    const cardLineBreak = document.createElement('div'); // Create div for the linebreak
    cardLineBreak.classList.add('cardLineBreak'); // Give it the class 'cardLineBreak'

    const cardDescription = document.createElement('div'); // Create div for description
    cardDescription.classList.add('cardDescription'); // Give it the class 'cardDescription'
    cardDescription.textContent = description;

    // Append title, line break, and description to the card
    card.appendChild(cardTitle);
    card.appendChild(cardLineBreak);
    card.appendChild(cardDescription);

    return card; // Return the constructed card element
}
// Renders all the cards on the page
async function renderCards() {
    try {
        for (let i = 0; i < keywordData.length; i++) {
            try {
                const card = createCard(keywordData[i], descriptionData[i]);
                cardHolder.appendChild(card);
            } catch (innerError) {
                console.log('Error rendering card:', innerError.message);
            }
        }
    } catch (outerError) {
        console.error('Error rendering cards:', outerError.message);
    }
}

// Initialize rendering cards
(async function initialize() {
    await fetchCard();
    renderCards();
})();