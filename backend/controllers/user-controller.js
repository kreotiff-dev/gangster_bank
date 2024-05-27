const userService = require('../service/user-service');
const authService = require('../service/auth-service');
const tokenService = require('../service/token-service'); // Импорт нового сервиса токенов
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const logger = require('../utils/logger');
const amqp = require('amqplib');

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
      logger.info(`Code request sent for user ID: ${messageData.user_id}`);
    } catch (e) {
      logger.error(`Error sending code request: ${e.message}`);
    }
  }

  // Регистрация пользователя
  registration = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Validation error:', errors.array());
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
      }
      const { phone, email, password, first_name, last_name } = req.body;
      console.log(req.body);  // Debugging line to check if data is received
      const userData = await userService.registration(phone, email, password, first_name, last_name);

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
      const userData = await authService.login(phone, password);
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
      const { refreshToken } = req.cookies; // Используйте camelCase
      logger.info(`Logging out user with refresh token: ${refreshToken}`);
      if (!refreshToken) {
        throw ApiError.UnauthError();
      }
      await userService.logout(refreshToken); // Передайте переменную правильно
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
      // Реализация активации пользователя
    } catch (e) {
      logger.error(`Error in activation: ${e.message}`);
      next(e);
    }
  }

  // Обновление токена
  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      logger.info(`Refreshing tokens with refresh token: ${refreshToken}`);
      if (!refreshToken) {
        throw ApiError.UnauthError();
      }
      const userData = await authService.refresh(refreshToken);
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
      const user_id = req.params.id;
      const user = await userService.getUserById(user_id);
      logger.info(`Retrieved user by ID: ${user_id}`);
      return res.json(user);
    } catch (e) {
      logger.error(`Error getting user by ID: ${e.message}`);
      next(e);
    }
  }
}

module.exports = new UserController();
