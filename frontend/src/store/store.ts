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
    isLoading = true;
    isAuthChecked = false;
    private lastRefreshAttempt: number = 0;
    private refreshDelay: number = 100;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user:IUser) {
        this.user = user;
        console.log('User set:', user);
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
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            navigate('/personal-cabinet');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Ошибка при входе:', error.response?.data);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
        }
    }

    async registration(phone: string, firstName: string, lastName: string, email: string, password: string): Promise<void> {
        try {
            const response = await AuthService.registration(phone, firstName, lastName, email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Ошибка при регистрации:', error.response?.data);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
        }
    }   

    async logout(navigate: NavigateFunction) {
        console.log('Logout function called');
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
            navigate('/');
        } catch (error: unknown) {
            console.log('Logout error:', error);
            if (axios.isAxiosError(error)) {
                console.error('Ошибка при выходе:', error.response?.data);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
        }
    }

    async checkAuth() {
        const now = Date.now();
        if (now - this.lastRefreshAttempt < this.refreshDelay) {
            console.log('Запрос на обновление токена слишком частый. Ожидание...');
            return;
        }

        this.lastRefreshAttempt = now;
        this.setLoading(true);

        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Ошибка при обновлении токена:', error.response?.data);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
            this.setAuth(false);
        } finally {
            this.setLoading(false);
            this.setAuthChecked(true);
        }
    }
}