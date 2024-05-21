const e = require('express');
const userService = require('../service/user-service');
const amqp = require('amqplib');
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController {
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
        } catch (e) {
            next(e)
        }
    }

    registration = async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { phone, email, password } = req.body;
            const userData = await userService.registration(phone, email, password);

            await this.sendCodeRequest({ userId: userData.id, phone });

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            console.log(userData);
            return res.json(userData);

        } catch (e) {
            next(e)
        }
    }

    login = async (req, res, next) => {
        try {
            const {phone, password} = req.body
            const userData = await userService.login(phone, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            console.log(userData);
            return res.json(userData);

        } catch(e) {
            next(e)
        }
    }

    logout = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status()

        } catch(e) {
            next(e)
            
        }
    }

    activate = async (req, res, next) => {
        try {

        } catch(e) {
            next(e)
        }
    }

    refresh = async (req, res, next) => {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);

        } catch(e) {
            next(e)
        }
    }

    confirm = async (req, res, next) => {
        try {
            const { code, phone } = req.body;
            const confirmationResult = await userService.confirmationCheck(code, phone)
            if (confirmationResult) {
                // Код подтверждения верный
                res.status(200).json({ message: 'Код подтверждения верный' });
            } else {
                // Код подтверждения неверный
                res.status(400).json({ message: 'Код подтверждения неверный' });
            }

        } catch(e) {
            next(e)
        }
    }

    getUsers = async (req, res, next) => {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)

        } catch(e) {
            next(e)
        }
    }
}

module.exports = new UserController();
