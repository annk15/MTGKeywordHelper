import config from './config.js';

// Listen for DOM content being fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const cardHolder = document.getElementById('cardHolder');

    // Fetch card data from API
    async function fetchCardData() {
        const url = `${config.apiUrl}${config.endpoint.keyword}`;
        console.log(url);
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

    // Fetches the Image
    async function fetchImage(keyword) {
        const url = `${config.apiUrl}${config.endpoint.keywordImage(keyword)}`;  // Use the keyword in the URL
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching image for keyword '${keyword}': ${response.status}`);
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } catch (error) {
            console.error('Error fetching image URL:', error.message);
        }
    }

    // Creates a card element with a title, image and description
    async function createCard(keyword, description) {
        const imageUrl = await fetchImage(keyword); //Fetches the imageurl related to the keyword property

        // Create a new div element for the card and adds 'card' and 'visible' class
        const card = document.createElement('div');
        card.classList.add('card');

        // Creates a image and adds classes
        const cardImage = document.createElement('div');
        cardImage.classList.add('cardImage');
        cardImage.style.backgroundImage = `url(${imageUrl})`;

        const cardTextContainer = document.createElement('div'); // Create div for text container
        cardTextContainer.classList.add('cardTextContainer'); // Give it the class 'cardTextContainer'
        
        //potential filter. Needs to fix the issue of text behind filter. Need to see if images are being fetched twice per image.
        //cardTextContainer.style.backgroundImage = `url(${imageUrl})`;
        //cardTextContainer.style.filter = 'blur(7px) brightness(0.4)';
        //cardTextContainer.style.transform = "rotate(180deg";
        //cardTextContainer.style.backgroundPosition = "bottom";
        
        //Release the object URL after it's loaded
        cardImage.addEventListener('load', () => {
            URL.revokeObjectURL(imageUrl);
        });

        const cardTitle = document.createElement('div'); // Create div for title
        cardTitle.classList.add('cardTitle'); // Give it the class 'cardTitle'
        cardTitle.textContent = keyword;

        const cardDescription = document.createElement('div'); // Create div for description
        cardDescription.classList.add('cardDescription'); // Give it the class 'cardDescription'
        cardDescription.textContent = description;

        // Create card structure by appending elements
        card.appendChild(cardImage);
        card.appendChild(cardTextContainer)
        cardTextContainer.appendChild(cardTitle);
        cardTextContainer.appendChild(cardDescription);
        
        return card; // Return the constructed card element
    }

    // Uses fetchCardData() and fetchImage to get the data from API and createCard() to make a card for each object, then renders them on the page.
    async function renderCards() {
        const cardData = await fetchCardData();

        // Creates a card for each object in the fetched data and append to cardHolder
        cardData.forEach(async ({ keyword, description }) => {
            try {
                const card = await createCard(keyword, description);
                cardHolder.appendChild(card);
            } catch (error) {
                console.error('Error rendering cards:', error.message);
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