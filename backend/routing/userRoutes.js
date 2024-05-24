const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');

// Маршрут для получения всех пользователей (требуется аутентификация)
router.get('/', authMiddleware, userController.getUsers);

// Маршрут для получения пользователя по ID (требуется аутентификация)
router.get('/:id', authMiddleware, userController.getUser);

module.exports = router;