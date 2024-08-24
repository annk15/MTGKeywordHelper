import React, { useState, useEffect } from 'react';
import { useData } from '../services/DataHandler.jsx';
import Card from './Card.jsx';
import Styles from './CardContainer.module.css';

function CardContainer({ searchQuery }) {
  const { cardData } = useData();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredData(cardData);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredData(
        cardData.filter(({ keyword }) =>
          keyword.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, cardData]);

  return (
    <div className={Styles['card-container']}>
      {filteredData.map(({ keyword, description, imageUrl }, index) => (
        <Card
          key={index}
          title={keyword}
          description={description}
          imageUrl={imageUrl}
        />
      ))}
    </div>
  );
}

export default CardContainer;
