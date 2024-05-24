const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

// Используем маршруты аутентификации
router.use('/auth', authRoutes);

// Используем маршруты пользователя
router.use('/users', userRoutes);

module.exports = router;
