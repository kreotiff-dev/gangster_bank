import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../index';

interface User {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  // Добавьте дополнительные поля по необходимости
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const { store } = useContext(Context);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${store.user.id}`, {
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
    
  }, [store.isAuth, store.user.id]);

  return (
    <div className="container">
      {userData ? (
        <div className="section">
          <p>Имя: {userData.firstname || 'N/A'}</p>
          <p>Фамилия: {userData.lastname || 'N/A'}</p>
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
