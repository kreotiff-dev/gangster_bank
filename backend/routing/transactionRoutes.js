const express = require('express');
const { getTransactionsByCardId } = require('../controllers/transactionController');
const router = express.Router();
const authMiddleware = require('..//middlewares/auth-middleware');

router.use(authMiddleware);

router.get('/cards/:id/transactions', getTransactionsByCardId);

module.exports = router;
