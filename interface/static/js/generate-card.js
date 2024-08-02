import KeywordsNotifier from './data-notifier.js';
import DataHandler from './data-handler.js'

export default class CardContainer {

    constructor(cardHolder) {
        this.cardHolder = cardHolder;
        KeywordsNotifier.regKeywordInfoData(this);
    }

    createCard(keyword, description) {
        // Create a new div element for the card and adds 'card' and 'visible' class
        const card = document.createElement('div');
        card.classList.add('card');

        // Creates a image and adds classes
        const cardImage = document.createElement('div');
        cardImage.classList.add('cardImage');

        const cardTextContainer = document.createElement('div'); // Create div for text container
        cardTextContainer.classList.add('cardTextContainer'); // Give it the class 'cardTextContainer'

        const cardTitle = document.createElement('h2'); // Create div for title
        cardTitle.classList.add('cardTitle'); // Give it the class 'cardTitle'
        cardTitle.textContent = keyword;

        const cardDescription = document.createElement('p'); // Create div for description
        cardDescription.classList.add('cardDescription'); // Give it the class 'cardDescription'
        cardDescription.textContent = description;

        // Create card structure by appending elements
        card.appendChild(cardImage);
        card.appendChild(cardTextContainer)
        cardTextContainer.appendChild(cardTitle);
        cardTextContainer.appendChild(cardDescription);

        DataHandler.fetchKeywordImageData(data => {
            cardImage.style.backgroundImage = `url(${data})`;
            cardImage.addEventListener('load', () => {
                URL.revokeObjectURL(data);
            });
        }, keyword)

        return card; // Return the constructed card element
    }

    onKeywordInfoData(data) {
        console.info(data)

        data.forEach(async ({ keyword, description }) => {
            try {
                const card = this.createCard(keyword, description);
                cardHolder.appendChild(card);
            } catch (error) {
                console.error('Error rendering cards:', error.message);
            }
        });
    }
}