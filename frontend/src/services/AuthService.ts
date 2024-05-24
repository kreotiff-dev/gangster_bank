import $api from "../http";
import {AxiosResponse} from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";

export interface User {
    id: string;
    phone: string;
    email: string;
    firstname: string;
    lastname: string;
    // Добавьте дополнительные поля по необходимости
}

export default class AuthService {
    static async login(phone: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', {phone, email, password})
    }

    static async registration(phone: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/registration', {phone, email, password})
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout')
    }

    static async getUser(userId: string): Promise<AxiosResponse<User>> {
        return $api.get<User>(`/users/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}

