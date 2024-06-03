const { where } = require('sequelize');
const { Card } = require('../models');

// Получение списка всех карт
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.findAll({ where: { userId: req.user.id } });
    res.json(cards);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получение одной карты по ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Заявка на создание новой карты
exports.createCard = async (req, res) => {
  try {
    const {
      cardNumber, expirationDate, cvv, cardLimit, cardBalance, lastUsageDate, cardCategory, 
      cardStatus, currency, securityParams, cardholderFirstname, cardholderLastname, cardType 
    } = req.body;
    const card = await Card.create({
      userId: req.user.id,
      cardNumber,
      expirationDate,
      cvv,
      cardLimit,
      cardBalance,
      lastUsageDate,
      cardCategory,
      cardStatus,
      currency,
      securityParams,
      cardholderFirstname,
      cardholderLastname,
      cardType
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Блокировка карты
exports.blockCard = async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }
    card.cardStatus = 'Blocked';
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Заявка на перевыпуск карты
exports.reissueCard = async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }
    // Логика перевыпуска карты (например, установка нового статуса)
    card.cardStatus = 'Reissue requested';
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Баланс по всем картам по userID
exports.getCardsBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const cards = await Card.findAll({ where: { userId } });
    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: 'Карты не найдены' });
    }
    const balances = cards.map(card => ({ balance: card.cardBalance }));
    res.json(balances);
  } catch (error) {
    console.error('Error fetching card balances:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

