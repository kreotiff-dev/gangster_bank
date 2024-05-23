import React from 'react';
import UserProfile from './UserProfile';
import Dashboard from './Dashboard';
import CardsList from './CardList';
import styles from '../styles/PersonalCabinet.module.css';

const cards = [
  { cardNumber: '1234 5678 9012 3456', type: 'Visa', balance: 15000 },
  { cardNumber: '9876 5432 1098 7654', type: 'MasterCard', balance: 25000 },
  // Добавьте другие карты по необходимости
];

const PersonalCabinet: React.FC = () => {
  return (
    <div className={styles.personalCabinet}>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>
      <UserProfile />
      <Dashboard />
      <CardsList cards={cards} />
      <footer className={styles.footer}>
        <p>&copy; 2024 Your Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PersonalCabinet;
