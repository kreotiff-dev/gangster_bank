const express = require('express');
const { 
  getTransactionsByCardId, 
  getAllUserTransactions, 
  createTransfer,
  getCategoryAnalytics,
  getPeriodAnalytics
} = require('../controllers/transactionController');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

router.use(authMiddleware);

// Существующие маршруты
router.get('/cards/:id/transactions', getTransactionsByCardId);

// Новые маршруты
router.get('/transactions', getAllUserTransactions);
router.post('/transactions/transfer', createTransfer);

// Маршруты для аналитики
router.get('/analytics/categories', getCategoryAnalytics);
router.get('/analytics/periods', getPeriodAnalytics);

module.exports = router;