import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  firstname: string;
  email: string;
  // Добавьте дополнительные поля по необходимости
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://192.168.1.63:3000/user/1');
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="container">
      {userData ? (
        <div className="section">
          <p>Name: {userData.firstname || 'N/A'}</p>
          <p>Email: {userData.email}</p>
          {/* Дополнительные данные профиля */}
        </div>
      ) : (
        <p className="error-message">Ошибка при получении данных. Попробуйте обновить страницу.</p>
      )}
    </div>
  );
};

export default UserProfile;
