import { FC, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import Dashboard from './Dashboard';
import CardsList from './CardList';
import styles from '../styles/PersonalCabinet.module.css';
import { fetchUserCards } from '../api/cards'; // ⬅️ новый импорт

const PersonalCabinet: FC = observer(() => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchUserCards(store.user.id); // даже если ID не используется
        setCards(data);
      } catch (err) {
        console.error('Ошибка при получении карт:', err);
      }
    };

    loadCards();
  }, [store.user.id]);

  return (
    <div className={styles.personalCabinet}>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>
      <button onClick={() => store.logout(navigate)}>Выйти</button>
      <Dashboard />
      <CardsList cards={cards} /> {/* ⬅️ теперь с пропсами */}
      <footer className={styles.footer}>
        <p>&copy; 2024 Your Bank. All rights reserved.</p>
      </footer>
    </div>
  );
});

export default PersonalCabinet;
