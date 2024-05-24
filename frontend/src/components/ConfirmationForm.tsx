import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ConfirmationForm.module.css'

interface ConfirmationFormProps {
  phoneNumber: string;
  closeForm: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ phoneNumber, closeForm }) => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: phoneNumber, code: code })
      });

      if (response.ok) {
        console.log('Navigate to /personal-cabinet');  // Лог перед редиректом
        navigate('/personal-cabinet');
        console.log('Navigation executed');  // Лог после редиректа
      } else {
        const error = await response.json();
        setErrorMessage(`Ошибка подтверждения: ${error.message}`);
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      setErrorMessage('Ошибка при отправке формы');
    }
    console.log("Код отправлен:", code);
  };

  return (
    <form className={styles.conformationForm} onSubmit={handleSubmit}>
      <p>Для подтверждения регистрации по номеру <span className={styles.highlight}>{phoneNumber}</span> введите пятизначный код, который вам был отправлен.</p>
      <input type="text" value={code} onChange={handleChange} placeholder="Введите код" maxLength={5} required />
      <button className={`${styles.btn} ${styles.btnNext}`} type="submit">Завершить</button>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </form>
  );
}

export default ConfirmationForm;
