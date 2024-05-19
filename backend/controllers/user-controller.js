const userService = require('../service/user-service');
const amqp = require('amqplib');

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
        } catch (error) {
            console.log(error);
        }
    }

    registration = async (req, res, next) => {
        try {
            const { phone, email, password } = req.body;
            const userData = await userService.registration(phone, email, password);

            await this.sendCodeRequest({ userId: userData.id, phone });

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            console.log(userData);
            return res.json(userData);

        } catch (e) {
            console.log(e);
        }
    }

    login = async (req, res, next) => {
        try {

        } catch(e) {
            
        }
    }

    logout = async (req, res, next) => {
        try {

        } catch(e) {
            
        }
    }

    activate = async (req, res, next) => {
        try {

        } catch(e) {
            
        }
    }

    refresh = async (req, res, next) => {
        try {

        } catch(e) {
            
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
            console.log(e);
            res.status(500).json({ message: 'Произошла ошибка при проверке кода подтверждения' });
        }
    }

    getUsers = async (req, res, next) => {
        try {
            res.json(['123', '456']);

        } catch(e) {
            console.log(error);
        res.status(500).json({ message: 'Произошла ошибка при проверке кода подтверждения' })
        }
    }
}

module.exports = new UserController();
