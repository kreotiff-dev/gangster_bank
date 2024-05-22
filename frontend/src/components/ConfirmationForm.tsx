import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://localhost:3000/api/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: phoneNumber, code: code })
      });

      if (response.ok) {
        navigate('/personal-cabinet');
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
    <form className="registration-form" onSubmit={handleSubmit}>
      <p>Для подтверждения регистрации по номеру {phoneNumber} введите пятизначный код, который вам был отправлен.</p>
      <input type="text" value={code} onChange={handleChange} placeholder="Введите код" maxLength={5} required />
      <button className='btn-next' type="submit">Завершить</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}

export default ConfirmationForm;
