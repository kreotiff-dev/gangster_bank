import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import PersonalCabinet from './components/PersonalCabinet';
import ProtectedRoute from './components/ProtectedRoute';
import { Context } from './index';
import { observer } from 'mobx-react-lite';


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
    setShowConfirm(true);
  };

  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

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
        <Route element={<ProtectedRoute />}>
          <Route path="/personal-cabinet" element={<PersonalCabinet />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default observer(App);

