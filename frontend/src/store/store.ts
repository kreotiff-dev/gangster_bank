import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import { NavigateFunction } from 'react-router-dom';

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    isAuthChecked = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user:IUser) {
        this.user = user;
        console.log('User set:', user); // Логирование данных пользователя
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    setAuthChecked(bool: boolean) {
        this.isAuthChecked = bool; 
    }

    async login(phone: string, email: string, password: string, navigate: NavigateFunction): Promise<void>  {
        try {
            const response = await AuthService.login(phone, email, password);
            console.log('Login response:', response); // Логирование ответа сервера
            console.log('Login access token:', response.data.accessToken); // Логирование accessToken
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            console.log('Login successful, navigating to /personal-cabinet');
            navigate('/personal-cabinet');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(error?.response?.data?.message);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
        }
    }

    async registration(phone: string, email: string, password: string): Promise<void> {
        try {
            const response = await AuthService.registration(phone, email, password);
            console.log('Registration response:', response); // Логирование ответа сервера
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(error?.response?.data?.message);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
        }
    }   

    async logout(navigate: NavigateFunction) {
        console.log('Logout function called');
        try {
            const response = await AuthService.logout();
            console.log('Logout response:', response);
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
            console.log('Logout successful, navigating to /');
            navigate('/');
        } catch (error: unknown) {
            console.log('Logout error:', error);
            if (axios.isAxiosError(error)) {
                console.log('Axios error message:', error?.response?.data?.message);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
        }
    }

    async checkAuth() {
        this.setLoading(true);
        // logger.info('Checking authentication...');
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, { withCredentials: true });
            // logger.info('Auth response:', response);
            localStorage.setItem('token', response.data.accessToken);
            // logger.info('Access token saved to local storage');
            this.setAuth(true);
            this.setUser(response.data.user);
            // logger.info('User authenticated and set');
        } catch (error: unknown) {
            // logger.error('CheckAuth error:', error);
            if (axios.isAxiosError(error)) {
                // logger.error('Axios error message:', error.response?.data?.message);
            } else {
                // logger.error('Unexpected error:', error);
            }
            this.setAuth(false);
        } finally {
            this.setLoading(false);
            this.setAuthChecked(true);
        }
    }
}