const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardRoutes')
const transactionRoutes = require('./transactionRoutes');

// маршруты аутентификации
router.use('/auth', authRoutes);

// маршруты пользователя
router.use('/users', userRoutes);

// маршруты карт
router.use('/cards', cardRoutes);

// транзакции по картам
router.use('/', transactionRoutes)

module.exports = router;
