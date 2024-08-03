import config from './config.js';

export default class DataHandler {

    static async fetchKeywordInfoData(onDataCallback) {

        const url = `${config.apiUrl}${config.endpoint.keyword}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error : Endpoint (Keyword abilities) responded with: ${response.status}`);
            }

            onDataCallback(await response.json());
        }
        catch (error) {
            console.error('Error fetching cards data:', error.message);
        }
    }

    static async fetchKeywordImageData(onDataCallback, keyword) {
        const url = `${config.apiUrl}${config.endpoint.keywordImage(keyword)}`;  // Use the keyword in the URL
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching image for keyword '${keyword}': ${response.status}`);
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            onDataCallback(await imageUrl);
        } catch (error) {
            console.error('Error fetching image URL:', error.message);
        }
    }

}