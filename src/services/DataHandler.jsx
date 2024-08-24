import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL, API_KEYWORD_URL, API_IMAGE_URL } from '../utils/config';

// Create a context to provide the data
const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

async function fetchKeywordInfoData() {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_KEYWORD_URL}`);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return await Promise.all(
      data.map(async (item) => {
        const imageUrl = await fetchKeywordImageData(item.keyword);
        return { ...item, imageUrl };
      })
    );
  } catch (error) {
    console.error('Error fetching card data:', error);
    return [];
  }
}

async function fetchKeywordImageData(keyword) {
  const url = `${API_BASE_URL}/${API_IMAGE_URL}/${keyword}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching image for keyword '${keyword}': ${response.status}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching image:', error);
    return '';
  }
}

export function DataProvider({ children }) {
  const [keywords, setKeywords] = useState([]);
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchKeywordInfoData();
        setCardData(data);
        setKeywords(data.map(item => item.keyword));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ keywords, cardData }}>
      {children}
    </DataContext.Provider>
  );
}
