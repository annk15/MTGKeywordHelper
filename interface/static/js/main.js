import DataHandler from './data-handler.js'
import KeywordsNotifier from './data-notifier.js';
import CardContainer  from "./generate-card.js";
import Search from "./search.js";

document.addEventListener('DOMContentLoaded', () => {
    new CardContainer("cardHolder");
    new Search();

    // Start fetch chain
    DataHandler.fetchKeywordInfoData(data => KeywordsNotifier.onKeywordInfoData(data));
});