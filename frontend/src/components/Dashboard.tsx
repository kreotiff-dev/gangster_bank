import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Dashboard.module.css';
import UserProfile from './UserProfile';

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('/api/cards/balance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Замените yourToken на ваш токен авторизации
          },
        });

        // Проверяем, получили ли мы массив балансов
        if (Array.isArray(response.data)) {
          const totalBalance = response.data.reduce((acc: number, card: { balance: string }) => acc + parseFloat(card.balance), 0);
          setBalance(totalBalance);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className={styles.dashBoard}>
      <div className={styles.balanceInfo}>
      <div className={styles.info}>
        <UserProfile />
        </div>
        <div className={styles.balance}>Ваш баланс: <br />{balance !== null ? `${balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}` : 'Загрузка...'}</div>
        <div className={styles.info}>
          <div className={styles.currentMonth}>Апрель 2023</div>
          <div className={styles.infoItems}>
            <div className={styles.infoItem}>
              <div className={styles.infoContent}>
                <strong>Расходы</strong>
                <br />
                35,000 ₽
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoContent}>
                <strong>Зачисления</strong>
                <br />
                75,000 ₽
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
