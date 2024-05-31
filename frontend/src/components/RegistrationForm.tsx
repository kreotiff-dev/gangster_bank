import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from "mobx-react-lite";
import styles from '../styles/RegistrationForm.module.css';

interface RegistrationFormProps {
  onRegister: (phone: string) => void;
  closeForm: () => void;
}

const RegistrationForm: FC<RegistrationFormProps> = ({ onRegister, closeForm }) => {
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { store } = useContext(Context);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают!");
      return;
    }
    try {
      await store.registration(phone, email, firstName, lastName, password);
      if (store.isAuth) {
        onRegister(phone);
        closeForm();
      } else {
        setErrorMessage('Ошибка регистрации');
      }
    } catch (error) {
      setErrorMessage('Ошибка при отправке формы');
    }
  };

  return (
    <div className={styles.registrationForm}>
      <form onSubmit={handleSubmit}>
        <input 
          type="tel" 
          name="phone" 
          placeholder="Номер телефона" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          name="firstName" 
          placeholder="Имя" 
          value={firstName} 
          onChange={e => setFirstName(e.target.value)} 
        />
        <input 
          type="text" 
          name="lastName" 
          placeholder="Фамилия" 
          value={lastName} 
          onChange={e => setLastName(e.target.value)} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Подтвердите пароль" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
        />
        <div>
          <button className={`${styles.btn} ${styles.btnBack}`} type="button" onClick={closeForm}>Назад</button>
          <button className={`${styles.btn} ${styles.btnNext}`} type="submit">Продолжить</button>
        </div>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default observer(RegistrationForm);
