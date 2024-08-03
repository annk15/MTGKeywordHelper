import KeywordsNotifier from './data-notifier.js';

export default class Search {

  constructor() {
    KeywordsNotifier.regKeywordInfoData(this);
  }

    // Show or hide cards, all cards will be shown if parameter is undefined
    showCards(matchingTags) {
      let keywordTitles = document.querySelectorAll('h2.cardTitle');
      keywordTitles.forEach(title => {
        let grandParentCard = title.parentNode.parentNode;
        let titleText = title.textContent.trim();

        if(matchingTags == undefined || matchingTags.includes(titleText)) {
            if(grandParentCard.classList.contains('hidden')) {
                grandParentCard.classList.add('visible');
                grandParentCard.classList.remove('hidden');
            }
        } else {
            grandParentCard.classList.add('hidden');
            grandParentCard.classList.remove('visible');
        }
      });
    }

    onKeywordInfoData(data) {
      var availableTags = []

      // Extract keyword data from json
      data.forEach(({ keyword }) => {
        availableTags.push(keyword);
      });

      // Create a bind to access outer function
      const showCardsBind = this.showCards.bind(this);

      // Customize autocomplete list to only show 5 items
      $("#search").autocomplete({
        source: function(request, response) {
          var results = $.ui.autocomplete.filter(availableTags, request.term);
          response(results.slice(0, 10));
        }
      });

      // Filter cards on Enter
      $("#search").on("keydown", function(event) {
        if (event.key === "Enter") {
          console.info("ENTER!")
            var results = $.ui.autocomplete.filter(availableTags, $(this).val());
            showCardsBind(results)
        }
    });

    }
}