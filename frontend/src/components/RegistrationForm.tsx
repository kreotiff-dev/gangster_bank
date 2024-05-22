import React, { useState } from 'react';
import styles from '../styles/RegistrationForm.module.css';

interface RegistrationFormProps {
  onRegister: (phone: string) => void;
  closeForm: () => void;
}

interface FormData {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, closeForm }) => {
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Пароли не совпадают!");
      return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            onRegister(formData.phone);
            closeForm();
        } else {
            const error = await response.json();
            setErrorMessage(`Ошибка регистрации: ${error.message}`);
        }
    } catch (error) {
      setErrorMessage('Ошибка при отправке формы');
    }
  };
  return (
    <div className={styles.registrationForm}>
      <form onSubmit={handleSubmit}>
        <input type="tel" name="phone" placeholder="Номер телефона" value={formData.phone} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="firstName" placeholder="Имя" value={formData.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Фамилия" value={formData.lastName} onChange={handleChange} />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Подтвердите пароль" value={formData.confirmPassword} onChange={handleChange} required />
        <div>
          <button className={styles.btnBack} type="button" onClick={closeForm}>Назад</button>
          <button className={styles.btnNext} type="submit">Продолжить</button>
        </div>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default RegistrationForm;
