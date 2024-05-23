import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import PersonalCabinet from './components/PersonalCabinet';


const App: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogin, setShowLogin] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('');
  const logoImage = process.env.PUBLIC_URL + '/images/logo.png' || '';
  const backgroundImage = process.env.PUBLIC_URL + '/images/background.jpg' || '';

  const handleRegister = (phone: string) => {
    setPhoneNumber(phone);
    setShowRegister(false);
    // setShowLogin(false);
    setShowConfirm(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomePage 
            showRegister={showRegister}
            showConfirm={showConfirm}
            showLogin={showLogin}
            phoneNumber={phoneNumber}
            handleRegister={handleRegister}
            setShowRegister={setShowRegister}
            setShowConfirm={setShowConfirm}
            setShowLogin={setShowLogin}
            logoImage={logoImage}
            backgroundImage={backgroundImage}
          />
        } />
        <Route path="/personal-cabinet" element={<PersonalCabinet />} />
      </Routes>
    </Router>
  );
}

export default App;

