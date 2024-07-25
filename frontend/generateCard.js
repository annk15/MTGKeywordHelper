const cardHolder = document.getElementById('cardHolder');
const titles = [
    'Deathtouch',
    'Haste',
    'Flying',
    'Reach',
    'Hexproof',
    'Double Strike',
    'First Strike',
    'Lifelink'
];
const descriptions = [
    'Deathtouch (Any amount of damage this deals to a creature is enough to destroy it.)',
    'Haste (This creature can attack and {T} as soon as it comes under your control.)',
    "Flying (This creature can't be blocked except by creatures with flying and/or reach.)",
    "Reach (This creature can block creatures with flying.)",
    "Hexproof (This permanent can't be the target of spells or abilities your opponents control.)",
    "Double strike (This creature deals both first-strike and regular combat damage.)",
    "First strike (This creature deals combat damage before creatures without first strike.)",
    "Lifelink (Damage dealt by this creature also causes you to gain that much life.)"
];

function makeCard(title, description) {
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



function generateCards(){
    for(let i = 0; i < titles.length; i++){
        const card1 = makeCard(titles[i], descriptions[i]);
        cardHolder.appendChild(card1);
    }
}

generateCards();