import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../index';
import styles from '../styles/UserProfile.module.css';

const apiUrl = process.env.REACT_APP_API_URL;

interface UserProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    avatar: string;
  };
  balance: number | null;
}

const UserProfile: React.FC<UserProps> = ({ user, balance }) => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const { store } = useContext(Context);

  useEffect(() => {

    if (!store.user || !store.user.id) {
      console.error('User ID is missing');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/${store.user.id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
      fetchUserData();
    
  }, [store.isAuth, store.user, store.user.id]);

  return (
    <div className={styles.profile}>
      <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
      {userData ? (
        <div className={styles.info}>
          <strong>Имя: {userData.user.firstName || 'N/A'}</strong>
          <p>Фамилия: {userData.user.lastName || 'N/A'}</p>
          <p>Email: {userData.user.email || 'N/A'}</p>
          <p>Тел.: {userData.user.phone}</p>
          {/* Дополнительные данные профиля */}
          <div className={styles.balance}>
            Ваш баланс: <br />
            {balance !== null ? `${balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}` : 'Загрузка...'}
          </div>
        </div>
      ) : (
        <p className="error-message">Ошибка при получении данных. Попробуйте обновить страницу.</p>
      )}
    </div>
  );
};

export default UserProfile;
