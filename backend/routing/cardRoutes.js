const express = require('express');
const { getCards, getCardById, requestNewCard, blockCard, reissueCard, getCardsBalance } = require('../controllers/cardController');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware'); 

router.use(authMiddleware);

router.get('/', getCards);
router.get('/balance', getCardsBalance)
router.get('/:id', getCardById);
router.post('/request', requestNewCard); // придумать как реализовать заявку
router.patch('/:id/block', blockCard);
router.patch('/:id/reissue', reissueCard); // придумать как реализовать заявку

module.exports = router;
