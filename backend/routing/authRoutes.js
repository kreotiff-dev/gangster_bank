const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');

// Маршрут для регистрации пользователя
router.post('/registration', 
    body('phone').isMobilePhone(), 
    body('email').isEmail(), 
    body('password').isLength({ min: 6, max: 16 }), 
    userController.registration);

// Маршрут для подтверждения пользователя
router.post('/confirm', userController.confirm);

// Маршрут для логина пользователя
router.post('/login', userController.login);

// Маршрут для выхода пользователя
router.post('/logout', userController.logout);

// Маршрут для активации пользователя
router.get('/activate/:link', userController.activate);

// Маршрут для обновления токена
router.get('/refresh', userController.refresh);

module.exports = router;
