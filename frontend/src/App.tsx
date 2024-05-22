import React, { useState } from 'react';
import '../src/styles/App.css';
import RegistrationForm from './components/RegistrationForm';
import ConfirmationForm from './components/ConfirmationForm';


const App: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const logoImage = process.env.PUBLIC_URL + '/images/logo.png' || '';
  const backgroundImage = process.env.PUBLIC_URL + '/images/background.jpg' || '';

  const handleRegister = (phone: string) => {
    setPhoneNumber(phone);
    setShowRegister(false);
    setShowConfirm(true);
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <header className="App-header">
        <img className="logo" src={logoImage} alt="Логотип" />
        {!showRegister && !showConfirm && (
          <div className='button-container'>
            <button className='registration-btn' onClick={() => setShowRegister(true)}>Регистрация</button>
            <button className='login-btn'>Авторизоваться</button>
          </div>
        )}
        {showRegister && <RegistrationForm onRegister={handleRegister} closeForm={() => setShowRegister(false)} />}
        {showConfirm && <ConfirmationForm phoneNumber={phoneNumber} closeForm={() => setShowConfirm(false)} />}
      </header>
    </div>
  );
}

export default App;

