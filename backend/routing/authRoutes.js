const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');


router.post('/registration', 
    body('phone').isMobilePhone(), 
    body('email').isEmail(), 
    body('password').isLength({ min: 6, max: 16 }), 
    userController.registration);


router.post('/confirm', userController.confirm);


router.post('/login', userController.login);


router.post('/logout', userController.logout);


router.get('/activate/:link', userController.activate);


router.get('/refresh', userController.refresh);

module.exports = router;
