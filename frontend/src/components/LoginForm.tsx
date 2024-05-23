import {FC, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { observer } from "mobx-react-lite";
import styles from '../styles/LoginForm.module.css'

interface LoginFormProps {
    closeForm: () => void;
    openRegisterForm: () => void;
  }

const LoginForm: FC<LoginFormProps> = ({ closeForm, openRegisterForm }) => {
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { store } = useContext(Context)
    const navigate = useNavigate();

    return (
        <div className={styles.loginForm}>
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
            <div>
                <button className={`${styles.btn} ${styles.btnNext}`} onClick={() => store.login(phone, email, password, navigate)}>Логин</button>
                <button className={`${styles.btn} ${styles.btnBack}`} onClick={closeForm}>Закрыть</button>
            </div>
            <div className={styles.registrationLinkContainer}>
                <span>Нету аккаунта? <a href="#" onClick={openRegisterForm} className={styles.registrationLink}>Зарегистрируйтесь</a></span>
            </div>
        </div>
    );
};

export default observer(LoginForm);