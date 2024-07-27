const searchBar = document.getElementById('keywordSearch');

// Debounce function to limit the rate at which the search function executes
function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

//levenshtein distance function, calculates number of edits needed to make
// one string into another
function levenshtein(a, b) {
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix = [];

    for (let i = 0; i <= bn; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= an; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= bn; i++) {
        for (let j = 1; j <= an; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j] + 1 // deletion
                );
            }
        }
    }

    return matrix[bn][an];
}

function performSearch(e) {
    let input = e.target.value.toLowerCase().trim();
    let keywordTitles = document.querySelectorAll('div.cardTitle');
    const maxDistance = 1; // Maximum allowed Levenshtein distance for fuzzy matching

    keywordTitles.forEach(title => {
        let parentCard = title.parentNode;
        let titleText = title.textContent.toLowerCase().trim();

        // Check if the input is a substring of the titleText
        let isSubstringMatch = titleText.includes(input);

        // Check Levenshtein distance if not a substring match
        let isFuzzyMatch = !isSubstringMatch && levenshtein(input, titleText) <= maxDistance;

        if (isSubstringMatch || isFuzzyMatch) {
            parentCard.classList.add('visible');
            parentCard.classList.remove('hidden');
        } else {
            parentCard.classList.add('hidden');
            parentCard.classList.remove('visible');
        }
    });
}

searchBar.addEventListener('keyup', debounce(performSearch, 300));
