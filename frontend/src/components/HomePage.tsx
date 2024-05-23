import React, { useState }  from 'react';
import RegistrationForm from './RegistrationForm';
import ConfirmationForm from './ConfirmationForm';
import LoginForm from './LoginForm';
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
  const [showLogin, setShowLogin] = useState(false);

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
      ) : showConfirm ? (
        <ConfirmationForm phoneNumber={phoneNumber} closeForm={() => setShowConfirm(false)} />
      ) : (
        <LoginForm closeForm={() => setShowLogin(false)} />
      )}
    </div>
  );
};

export default HomePage;
