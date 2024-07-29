const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');


router.get('/', authMiddleware, userController.getUsers);


router.get('/:id', authMiddleware, userController.getUser);

module.exports = router;