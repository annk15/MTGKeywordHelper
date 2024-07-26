const cardHolder = document.getElementById('cardHolder');
const cards = cardHolder.getElementsByClassName('card');
const searchBar = document.getElementById('keywordSearch');
let keywords 

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
    card.classList.add('visible');

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

function generateCards() {
    for (let i = 0; i < titles.length; i++) {
        const cards = makeCard(titles[i], descriptions[i]);
        cardHolder.appendChild(cards);
    }
}
for (let i = 0; i < 10; i++) {
    generateCards();

}

//temp obj version of card
/* const cardValue = {
    title:"Deathtouch",
    description:"Deathtouch (Any amount of damage this deals to a creature is enough to destroy it.)"
}

const cardTest = makeCard(cardValue.title, cardValue.description);
cardHolder.appendChild(cardTest); */

searchBar.addEventListener('keyup', e => {
    let input = e.target.value.toLowerCase();
    console.log(input);
    let keywordTitles = document.querySelectorAll('div.cardTitle');
    
    keywordTitles.forEach(title => {
        if(title.textContent.toLowerCase().includes(input)){
            title.parentNode.classList.add('visible');
            title.parentNode.classList.remove('hidden');
        }
        else{
            title.parentNode.classList.add('hidden');
            title.parentNode.classList.remove('visible');
        }
    })
})