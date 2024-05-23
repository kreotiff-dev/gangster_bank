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

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user:IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(phone: string, email: string, password: string, navigate: NavigateFunction): Promise<void>  {
        try {
            const response = await AuthService.login(phone, email, password);
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
    async registration(phone: string, email: string, password: string) {
        try {
            const response = await AuthService.registration(phone, email, password);
            console.log(response)
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
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(error?.response?.data?.message);
            } else {
                console.error('Произошла непредвиденная ошибка', error);
            }
        } finally {
            this.setLoading(false);
        }
    }
}