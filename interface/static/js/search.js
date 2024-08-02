import KeywordsNotifier from './data-notifier.js';

export default class Search {

  constructor() {
    KeywordsNotifier.regKeywordInfoData(this);
  }

    onKeywordInfoData(data) {
      var availableTags = []

      data.forEach(({ keyword }) => {
        availableTags.push(keyword);
      });

      // Customize the autocomplete to limit the number of results shown
      $("#search").autocomplete({
        source: function(request, response) {

          console.info("Updating cards!")

          var results = $.ui.autocomplete.filter(availableTags, request.term);

          let keywordTitles = document.querySelectorAll('h2.cardTitle');
          keywordTitles.forEach(title => {
            let grandParentCard = title.parentNode.parentNode;
            let titleText = title.textContent.trim();

            if(results.includes(titleText)) {
                if(grandParentCard.classList.contains('hidden')) {
                    grandParentCard.classList.add('visible');
                    grandParentCard.classList.remove('hidden');
                }
            } else {
                grandParentCard.classList.add('hidden');
                grandParentCard.classList.remove('visible');
            }
          });

          // Limit the number of results displayed
          response(results.slice(0, 5));  // Adjust the number to limit the results
        }
      });
    }
}