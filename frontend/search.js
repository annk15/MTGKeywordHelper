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

/* Levenshtein distance for fuzzy search. 
Levenshtein distance measures how many 'substitutions', 'insertions' and 'deletions' needed to change one string into another. 
Changing the string 'Teacher' into 'Reach' would require 1 substitution for the 'T' into 'R', and 2 deletions for the 'er', 
making the Levenshtein distance 3.
An exact match would have the distance value 0. 
If the distance value is <= the max distance value then the result is shown.*/
function levenshtein(a, b) {
    const an = a.length; // Searchbar input
    const bn = b.length; //Keyword card titles

    //This is the early exit condition, immedietly returning the distance incase one value is empty to prevent further processing
    if (an === 0) return bn;  // If 'a' is empty, return length of 'b'
    if (bn === 0) return an; // If 'b' is empty, return length of 'a'

    const matrix = [];

    // Initialize matrix with base cases
    for (let i = 0; i <= bn; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= an; j++) {
        matrix[0][j] = j;
    }
    // Populate the matrix with Levenshtein distances
    for (let i = 1; i <= bn; i++) {
        for (let j = 1; j <= an; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]; // No change needed if characters match
            } else {
                // Calculate the minimum edit distance considering substitution, insertion, and deletion
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j] + 1 // deletion
                );
            }
        }
    }

    return matrix[bn][an]; // Return the computed distance
}

//Function for searching for keyword titles among cards
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

        // Show or hide the card based on matching criteria
        if (isSubstringMatch || isFuzzyMatch) {
            parentCard.classList.add('visible');
            parentCard.classList.remove('hidden');
        } else {
            parentCard.classList.add('hidden');
            parentCard.classList.remove('visible');
        }
    });
}

//Runs performSearch after a debounce delay, in favor of performance
searchBar.addEventListener('keyup', debounce(performSearch, 500));
