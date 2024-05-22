import React, { useState } from 'react';
import '../styles/RegistrationForm.css';

interface RegistrationFormProps {
  onRegister: (phone: string) => void;
  closeForm: () => void;
}

interface FormData {
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, closeForm }) => {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

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
      alert("Пароли не совпадают!");
      return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: formData.phoneNumber,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password
            })
        });
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            alert('Регистрация успешна!');
            // Предположим, что валидация прошла успешно
            onRegister(formData.phoneNumber);
            closeForm();
        } else {
            const error = await response.json();
            alert(`Ошибка регистрации: ${error.message}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        alert('Ошибка при отправке формы');
        }
  };
  return (
    <div className="registration-form">
      <form onSubmit={handleSubmit}>
        <input type="tel" name="phoneNumber" placeholder="Номер телефона" value={formData.phoneNumber} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="firstName" placeholder="Имя" value={formData.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Фамилия" value={formData.lastName} onChange={handleChange} />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Подтвердите пароль" value={formData.confirmPassword} onChange={handleChange} required />
        <div>
          <button className='btn-back' type="button" onClick={closeForm}>Назад</button>
          <button className='btn-next' type="submit">Продолжить</button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
