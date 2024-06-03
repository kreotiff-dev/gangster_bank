import React from 'react';
import RegistrationForm from './RegistrationForm';
import ConfirmationForm from './ConfirmationForm';
import LoginForm from './LoginForm';
import styles from '../styles/HomePage.module.css';

interface HomePageProps {
  showRegister: boolean;
  showConfirm: boolean;
  showLogin: boolean;
  phoneNumber: string;
  handleRegister: (phone: string) => void;
  setShowRegister: (value: boolean) => void;
  setShowConfirm: (value: boolean) => void;
  setShowLogin: (value: boolean) => void;
  logoImage: string;
  backgroundImage: string;
}

const HomePage: React.FC<HomePageProps> = ({
  showRegister,
  showConfirm,
  showLogin,
  phoneNumber,
  handleRegister,
  setShowRegister,
  setShowConfirm,
  setShowLogin,
  logoImage,
  backgroundImage
}) => {

  return (
    <div className={styles.homePage} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <img className={styles.logo} src={logoImage} alt="Логотип" />
      {!showRegister && !showConfirm && !showLogin ? (
        <div className={styles.buttonContainer}>
          <button className={styles.registrationBtn} onClick={() => setShowRegister(true)}>Регистрация</button>
          <button className={styles.loginBtn} onClick={() => setShowLogin(true)}>Авторизоваться</button>
        </div>
      ) : showRegister ? (
        <RegistrationForm onRegister={handleRegister} closeForm={() => setShowRegister(false)} />
      ) : showLogin ? (
        <LoginForm closeForm={() => setShowLogin(false)} openRegisterForm={() => { setShowLogin(false); setShowRegister(true); }} />
    ) : (
        <ConfirmationForm phoneNumber={phoneNumber} closeForm={() => setShowConfirm(false)} />
    )}
    </div>
  );
};

export default HomePage;
