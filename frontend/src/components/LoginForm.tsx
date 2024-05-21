import React, {FC, useContext, useState} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";

const LoginForm: FC = () => {
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { store } = useContext(Context)

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
            <button onClick={() => store.login(phone, email, password)}>Логин</button>
            <button onClick={() => store.registration(phone, email, password)}>Регистрация</button>

        </div>
    );
};

export default LoginForm;