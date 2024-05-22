import React, { useState } from 'react';

interface ConfirmationFormProps {
  phoneNumber: string;
  closeForm: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ phoneNumber, closeForm }) => {
  const [code, setCode] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Здесь будет логика отправки кода на сервер для подтверждения
    console.log("Код отправлен:", code);
    // После проверки кода можно закрыть форму или сообщить о результате
    closeForm();
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <p>Для подтверждения регистрации по номеру {phoneNumber} введите пятизначный код, который вам был отправлен.</p>
      <input type="text" value={code} onChange={handleChange} placeholder="Введите код" maxLength={5} required />
      <button className='btn-next' type="submit">Завершить</button>
    </form>
  );
}

export default ConfirmationForm;
