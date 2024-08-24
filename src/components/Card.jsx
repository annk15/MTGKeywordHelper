import React from 'react';
import Styles from './Card.module.css';

function Card({ title, description, imageUrl }) {
  return (
    <div className={Styles['card']}>
      <div className={Styles['card-image-container']}>
        <div className={Styles['card-image']} style={{ backgroundImage: `url(${imageUrl})` }}></div>
      </div>
      <div className={Styles['card-text-container']}>
        <h2 className={Styles['card-title']}>{title}</h2>
        <hr className={Styles['card-break']}/>
        <p className={Styles['card-description']}>{description}</p>
      </div>
    </div>
  );
}

export default Card;
