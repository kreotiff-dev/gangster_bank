import React, { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import UserProfile from './UserProfile';
import Dashboard from './Dashboard';
import CardsList from './CardList';
import styles from '../styles/PersonalCabinet.module.css';

// const cards = [
//   { cardNumber: '1234 5678 9012 3456', type: 'Visa', balance: 15000 },
//   { cardNumber: '3455 2346 7898 2134', type: 'MasterCard', balance: 650000 },
//   { cardNumber: '0789 4562 9784 1234', type: 'UnionPay', balance: 0 },
//   { cardNumber: '5642 9889 6133 0065', type: 'МИР', balance: 651233 },
//   // Добавьте другие карты по необходимости
// ];

const PersonalCabinet: FC = observer(() => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div className={styles.personalCabinet}>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>
      <button onClick={() => store.logout(navigate)}>Выйти</button>
      <UserProfile />
      <Dashboard />
      <CardsList /> 
      <footer className={styles.footer}>
        <p>&copy; 2024 Your Bank. All rights reserved.</p>
      </footer>
    </div>
  );
});

export default PersonalCabinet;
