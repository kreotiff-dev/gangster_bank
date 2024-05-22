import React from 'react';
import styles from '../styles/PersonalCabinet.module.css';


const PersonalCabinet: React.FC = () => {
  return (
    <div className={styles.personalCabinet}>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>
    </div>
  );
};

export default PersonalCabinet;
