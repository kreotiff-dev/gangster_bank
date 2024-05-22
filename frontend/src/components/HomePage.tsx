import React from 'react';
import RegistrationForm from './RegistrationForm';
import ConfirmationForm from './ConfirmationForm';
import styles from '../styles/HomePage.module.css';

interface HomePageProps {
  showRegister: boolean;
  showConfirm: boolean;
  phoneNumber: string;
  handleRegister: (phone: string) => void;
  setShowRegister: (value: boolean) => void;
  setShowConfirm: (value: boolean) => void;
  logoImage: string;
  backgroundImage: string;
}

const HomePage: React.FC<HomePageProps> = ({
  showRegister,
  showConfirm,
  phoneNumber,
  handleRegister,
  setShowRegister,
  setShowConfirm,
  logoImage,
  backgroundImage
}) => {
  return (
    <div className={styles.homePage} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <img className={styles.logo} src={logoImage} alt="Логотип" />
      {!showRegister && !showConfirm ? (
        <div className={styles.buttonContainer}>
          <button className={styles.registrationBtn} onClick={() => setShowRegister(true)}>Регистрация</button>
          <button className={styles.loginBtn}>Авторизоваться</button>
        </div>
      ) : showRegister ? (
        <RegistrationForm onRegister={handleRegister} closeForm={() => setShowRegister(false)} />
      ) : (
        <ConfirmationForm phoneNumber={phoneNumber} closeForm={() => setShowConfirm(false)} />
      )}
    </div>
  );
};

export default HomePage;
