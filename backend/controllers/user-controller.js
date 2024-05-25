const e = require('express');
const userService = require('../service/user-service');
const amqp = require('amqplib');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const logger = require('../utils/logger'); // Импорт логгера

class UserController {
    // Отправка запроса на код подтверждения
    sendCodeRequest = async (messageData) => {
        try {
            const connection = await amqp.connect({
                hostname: '37.46.129.245',
                port: 5672,
                username: 'admin',
                password: '123456'
            });
            const channel = await connection.createChannel();
            await channel.assertQueue('code_requests');
            channel.sendToQueue('code_requests', Buffer.from(JSON.stringify(messageData)));
            logger.info(`Code request sent for user ID: ${messageData.userId}`);
        } catch (e) {
            logger.error(`Error sending code request: ${e.message}`);
            next(e);
        }
    }

    // Регистрация пользователя
    registration = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error(`Validation error: ${errors.array()}`);
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { phone, email, password } = req.body;
            const userData = await userService.registration(phone, email, password);

            await this.sendCodeRequest({ userId: userData.id, phone });

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            logger.info(`User registered: ${JSON.stringify(userData)}`);
            return res.json(userData);

        } catch (e) {
            logger.error(`Error in registration: ${e.message}`);
            next(e);
        }
    }

    // Авторизация пользователя
    login = async (req, res, next) => {
        try {
            const { phone, password } = req.body;
            const userData = await userService.login(phone, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            logger.info(`User logged in: ${JSON.stringify(userData)}`);
            return res.json(userData);

        } catch (e) {
            logger.error(`Error in login: ${e.message}`);
            next(e);
        }
    }

    // Выход пользователя
    logout = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            logger.info('User logged out');
            return res.status(204).send();

        } catch (e) {
            logger.error(`Error in logout: ${e.message}`);
            next(e);
        }
    }

    // Активация пользователя
    activate = async (req, res, next) => {
        try {

        } catch (e) {
            logger.error(`Error in activation: ${e.message}`);
            next(e);
        }
    }

    // Обновление токена
    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            logger.info(`Token refreshed for user ID: ${userData.id}`);
            return res.json(userData);

        } catch (e) {
            logger.error(`Error in refresh: ${e.message}`);
            next(e);
        }
    }

    // Подтверждение кода
    confirm = async (req, res, next) => {
        try {
            const { code, phone } = req.body;
            const confirmationResult = await userService.confirmationCheck(code, phone);
            if (confirmationResult) {
                logger.info('Confirmation code is correct');
                res.status(200).json({ message: 'Код подтверждения верный' });
            } else {
                logger.info('Confirmation code is incorrect');
                res.status(400).json({ message: 'Код подтверждения неверный' });
            }

        } catch (e) {
            logger.error(`Error in confirmation: ${e.message}`);
            next(e);
        }
    }

    // Получение всех пользователей
    getUsers = async (req, res, next) => {
        try {
            const users = await userService.getAllUsers();
            logger.info('Retrieved all users');
            return res.json(users);

        } catch (e) {
            logger.error(`Error getting users: ${e.message}`);
            next(e);
        }
    }

    // Получение пользователя по ID
    getUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            logger.info(`Retrieved user by ID: ${userId}`);
            return res.json(user);
        } catch (e) {
            logger.error(`Error getting user by ID: ${e.message}`);
            next(e);
        }
    }
}

module.exports = new UserController();
