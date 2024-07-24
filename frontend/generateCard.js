const cardHolder = document.getElementById('cardHolder');

function generateCard(title, description) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('cardTitle');
    cardTitle.textContent = title;

    const cardLineBreak = document.createElement('div');
    cardLineBreak.classList.add('cardLineBreak');

    const cardDescription = document.createElement('div');
    cardDescription.classList.add('cardDescription');
    cardDescription.textContent = description;

    card.appendChild(cardTitle);
    card.appendChild(cardLineBreak);
    card.appendChild(cardDescription);

    return card;
}

const card1 = generateCard('Title', 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non officia adipisci praesentium quae numquam nihil veritatis, temporibus in dicta porro nostrum ipsum voluptatum perspiciatis recusandae, omnis ad consequuntur, molestiae magnam.');

cardHolder.appendChild(card1);