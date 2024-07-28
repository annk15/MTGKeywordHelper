// Listen for DOM content being fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const cardHolder = document.getElementById('cardHolder');

    // Fetch card data from API
    async function fetchCardData() {
        const url = 'http://127.0.0.1:5000/keyword-abilities';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error : Endpoint (Keyword abilities) responded with: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('Error fetching cards data:', error.message);
        }
    }

    // Creates a card element with a title, description and a line break between them
    function createCard(keyword, description) {
        // Create a new div element for the card and adds 'card' and 'visible' class
        const card = document.createElement('div');
        card.classList.add('card', 'visible');

        const cardTitle = document.createElement('div'); // Create div for title
        cardTitle.classList.add('cardTitle'); // Give it the class 'cardTitle'
        cardTitle.textContent = keyword;

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

    // Uses fetchCardData() to get the data from API and createCard() to make a card for each object, then renders them on the page.
    async function renderCards() {
        const cardData = await fetchCardData();

        // Makes a card for each object in the fetched data and append to cardHolder
        cardData.forEach(({ keyword, description }) => {
            try {
                const card = createCard(keyword, description);
                cardHolder.appendChild(card);
            } catch (error) {
                console.error('Error rendering cards:', Error.message);
            }
        });
    }
    // Initialize card rendering
    async function initialize() {
        try {
            await renderCards();
        } catch (error) {
            console.error('Error in Initialize:', error.message);
        }
    }

    initialize();
});