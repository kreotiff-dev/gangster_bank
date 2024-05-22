import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import ConfirmationForm from './components/ConfirmationForm';
import PersonalCabinet from './components/PersonalCabinet';
import '../src/styles/App.css';


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
    <Router>
      <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <img className="logo" src={logoImage} alt="Логотип" />
        <Routes>
          <Route path="/" element={
            !showRegister && !showConfirm ? (
              <div className='button-container'>
                <button className='registration-btn' onClick={() => setShowRegister(true)}>Регистрация</button>
                <button className='login-btn'>Авторизоваться</button>
              </div>
            ) : showRegister ? (
              <RegistrationForm onRegister={handleRegister} closeForm={() => setShowRegister(false)} />
            ) : (
              <ConfirmationForm phoneNumber={phoneNumber} closeForm={() => setShowConfirm(false)} />
            )
          } />
          <Route path="/personal-cabinet" element={<PersonalCabinet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

