import $api from "../http";
import {AxiosResponse} from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";

export interface User {
    id: string;
    phone: string;
    email: string;
    firstName: string;
    lastName: string;

}

export default class AuthService {
    static async login(phone: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', {phone, email, password})
    }

    static async registration(phone: string, email: string, lastName: string, firstName: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/registration', {phone, email, lastName, firstName, password})
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout')
    }

    static async getUser(user_id: string): Promise<AxiosResponse<User>> {
        return $api.get<User>(`/users/${user_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}

