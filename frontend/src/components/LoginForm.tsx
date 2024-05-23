import {FC, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { observer } from "mobx-react-lite";

interface LoginFormProps {
    closeForm: () => void;
  }

const LoginForm: FC<LoginFormProps> = ({ closeForm }) => {
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { store } = useContext(Context)
    const navigate = useNavigate();

    return (
        <div>
            <input 
                onChange = {e => setPhone(e.target.value)}
                value = {phone}
                type = "tel" 
                name="phone"
                placeholder = 'Phone'
            />
            <input 
                onChange = {e => setEmail(e.target.value)}
                value = {email}
                type = "email" 
                name="email"
                placeholder = 'Email'
            />
            <input 
                onChange = {e => setPassword(e.target.value)}
                value = {password}
                type = "password" 
                name="password"
                placeholder = 'Пароль'
            />
            <button onClick={() => store.loginAndNavigate(phone, email, password, navigate)}>Логин</button>
            <button onClick={() => store.registration(phone, email, password)}>Регистрация</button>
            <button onClick={closeForm}>Закрыть</button>
        </div>
    );
};

export default observer(LoginForm);