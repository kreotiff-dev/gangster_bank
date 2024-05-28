import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from '../index';

const ProtectedRoute: React.FC = () => {
    const { store } = useContext(Context);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
          if (localStorage.getItem('token')) {
            try {
              console.log('Checking authentication...');
              await store.checkAuth();
            } catch (error) {
              console.error('Ошибка проверки аутентификации:', error);
            }
          }
          setIsCheckingAuth(false);
        };
        checkAuth();
      }, [store]);

    if (isCheckingAuth || store.isLoading) {
        return <div>Loading...</div>; // Можно заменить на индикатор загрузки
    }
  
    if (!store.isAuth) {
      console.log('не авторизован=(');
      return <Navigate to="/" />;
    }
  
    return <Outlet />;
  };
  
  export default observer(ProtectedRoute);
