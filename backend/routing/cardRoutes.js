const express = require('express');
const { getCards, getCardById, createCard, blockCard, reissueCard } = require('../controllers/cardController');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware'); 

router.use(authMiddleware);

router.get('/', getCards);
router.get('/:id', getCardById);
router.post('/', createCard); // придумать как реализовать заявку
router.patch('/:id/block', blockCard);
router.patch('/:id/reissue', reissueCard); // придумать как реализовать заявку

module.exports = router;
