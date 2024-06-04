import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import styles from '../styles/Dashboard.module.css';
import UserProfile from './UserProfile';
import { fetchCardsBalance } from '../api/cards';
import { Context } from '../index';
import { API_URL } from "../http";

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const { store } = useContext(Context);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(`${API_URL}/exchange-rates`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // console.log('Exchange rates:', response.data.Valute); // Отладочное сообщение
        setExchangeRates(response.data.Valute);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const cardsBalance = await fetchCardsBalance(store.user.id)

        if (Array.isArray(cardsBalance) && exchangeRates) {
          const baseCurrency = 'RUB';
          const totalBalance = cardsBalance.reduce((acc: number, card: { balance: string; currency: string }) => {
            const cardBalance = parseFloat(card.balance);
            const cardCurrency = card.currency;

            if (!cardCurrency) {
              console.warn(`No currency specified for card balance: ${cardBalance}`);
              return acc;
            }

            const rateInfo = exchangeRates[cardCurrency] || { Value: 1, Nominal: 1 };
            const baseRateInfo = exchangeRates[baseCurrency] || { Value: 1, Nominal: 1 };

            const rate = rateInfo.Value / rateInfo.Nominal;
            const baseRate = baseRateInfo.Value / baseRateInfo.Nominal;

            const convertedBalance = cardCurrency === baseCurrency ? cardBalance : (cardBalance * rate) / baseRate;

            // console.log(`Card Balance: ${cardBalance}, Card Currency: ${cardCurrency}, Rate: ${rate}, Base Rate: ${baseRate}, Converted Balance: ${convertedBalance}`); // Отладочное сообщение

            return acc + convertedBalance;
          }, 0);
          setBalance(totalBalance);
        } else {
          console.error('Unexpected response data:', cardsBalance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    if (exchangeRates) {
      fetchBalance();
    }
  }, [exchangeRates, store.user.id]);

  return (
    <div className={styles.dashBoard}>
      <div className={styles.balanceInfo}>
        <div className={styles.info}>
          <UserProfile />
        </div>
        <div className={styles.balance}>
          Ваш баланс: <br />
          {balance !== null ? `${balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}` : 'Загрузка...'}
        </div>
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
