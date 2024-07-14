import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import Dashboard from './Dashboard';
import CardsList from './CardList';
import styles from '../styles/PersonalCabinet.module.css';



const PersonalCabinet: FC = observer(() => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div className={styles.personalCabinet}>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>
      <button onClick={() => store.logout(navigate)}>Выйти</button>
      <Dashboard />
      <CardsList /> 
      <footer className={styles.footer}>
        <p>&copy; 2024 Your Bank. All rights reserved.</p>
      </footer>
    </div>
  );
});

export default PersonalCabinet;
