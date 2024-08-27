import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_HOST_ADDRESS, API_HOST_PORT } from '../utils/config';

// Create a context to provide the data
const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

async function fetchKeywordInfoData() {

    const response = await fetch(`${API_HOST_ADDRESS}:${API_HOST_PORT}/keyword-reminders`);
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

}

async function fetchKeywordImageData(keyword) {
  const url = `${API_HOST_ADDRESS}:${API_HOST_PORT}/keyword-image/${keyword}`;
  console.log(url);
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
