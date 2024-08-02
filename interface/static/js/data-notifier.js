export default class KeywordsNotifier {

    static regKeywordData(instance) {

        if (!KeywordsNotifier.keywordSubscribers) {
            KeywordsNotifier.keywordSubscribers = [];
        }

        KeywordsNotifier.keywordSubscribers.push(instance);
    }

    static onKeywordData(data) {
        KeywordsNotifier.keywordSubscribers.forEach(instance => {
            instance.onKeywordData(data);
        });
    }

    static regKeywordInfoData(instance) {

        if (!KeywordsNotifier.keywordInfoSubscribers) {
            KeywordsNotifier.keywordInfoSubscribers = [];
        }

        KeywordsNotifier.keywordInfoSubscribers.push(instance);
    }

    static onKeywordInfoData(data) {
        KeywordsNotifier.keywordInfoSubscribers.forEach(instance => {
            instance.onKeywordInfoData(data);
        });
    }

    static regKeywordImageData(instance) {

        if (!KeywordsNotifier.keywordImageSubscribers) {
            KeywordsNotifier.keywordImageSubscribers = [];
        }

        KeywordsNotifier.keywordImageSubscribers.push(instance);
    }

    static onKeywordImageData(data) {
        KeywordsNotifier.keywordImageSubscribers.forEach(instance => {
            instance.onKeywordImageData(data);
        });
    }
}