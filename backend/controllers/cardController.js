const { where } = require('sequelize');
const { Card } = require('../models');
const UserDto = require('../dtos/user-dto');
const logger = require('../utils/logger');
const rabbitmq = require('../utils/rabbitmq');


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

exports.requestNewCard = async (req, res) => {
  try {
      const user = new UserDto(req.user);
      const { cardType, cardCategory, cardBalance, currency } = req.body;
      const appId = 'gbank';

      const messageData = {
          userId: user.id,
          app_id: appId,
          cardType,
          cardCategory,
          cardBalance,
          currency,
          firstName: user.firstName,
          lastName: user.lastName
      };

      await rabbitmq.sendToQueue('card_application_requests' ,messageData);
      
      logger.info(`Card request sent for user ID: ${req.user.id}`);

      res.status(200).json({ message: 'Card request sent successfully' });
  } catch (error) {
      logger.error(`Error in card request: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
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
    // Здесь будет логика перевыпуска карты
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
    const cards = await Card.findAll({ where: { userId: req.user.id } });
    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: 'Карты не найдены' });
    }
    const balances = cards.map(card => ({ balance: card.cardBalance, currency: card.currency }));
    res.json(balances);
  } catch (error) {
    console.error('Error fetching card balances:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

