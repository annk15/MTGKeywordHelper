const config = {
    apiUrl: 'http://127.0.0.1:5000',
    endpoint: {
        keyword: `/keyword-abilities`,
        keywordImage: (keyword) => `/keyword-image/${keyword}`
    }

};

export default config;