import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../index';

const apiUrl = process.env.REACT_APP_API_URL;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  // Добавьте дополнительные поля по необходимости
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
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
    <div className="container">
      {userData ? (
        <div className="section">
          <p>Имя: {userData.firstName || 'N/A'}</p>
          <p>Фамилия: {userData.lastName || 'N/A'}</p>
          <p>Email: {userData.email || 'N/A'}</p>
          <p>Тел.: {userData.phone}</p>
          {/* Дополнительные данные профиля */}
        </div>
      ) : (
        <p className="error-message">Ошибка при получении данных. Попробуйте обновить страницу.</p>
      )}
    </div>
  );
};

export default UserProfile;
