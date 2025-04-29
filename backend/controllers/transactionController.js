const { Transaction, Card, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Получение всех транзакций пользователя
 */
exports.getAllUserTransactions = async (req, res) => {
  try {
    // Найти все карты пользователя
    const userCards = await Card.findAll({ 
      where: { userId: req.user.id },
      attributes: ['id']
    });
    
    // Получить массив ID карт
    const cardIds = userCards.map(card => card.id);
    
    // Получить транзакции по этим картам
    const transactions = await Transaction.findAll({
      where: { cardId: { [Op.in]: cardIds } },
      order: [['transactionDate', 'DESC']]
    });
    
    res.json(transactions);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Выполнение перевода между картами
 */
exports.createTransfer = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { fromCardId, toCardId, toCardNumber, toPhoneNumber, amount, comment } = req.body;
    
    // Проверка входных данных
    if (!fromCardId || !amount || amount <= 0) {
      return res.status(400).send({ message: 'Неверные данные для перевода' });
    }
    
    // Проверка прав доступа к исходной карте
    const fromCard = await Card.findOne({ 
      where: { id: fromCardId, userId: req.user.id },
      transaction: t
    });
    
    if (!fromCard) {
      await t.rollback();
      return res.status(404).send({ message: 'Карта отправителя не найдена' });
    }
    
    // Проверка баланса
    if (fromCard.cardBalance < amount) {
      await t.rollback();
      return res.status(400).send({ message: 'Недостаточно средств на карте' });
    }
    
    // Поиск карты получателя
    let toCard = null;
    let transferTitle = 'Перевод средств';
    
    if (toCardId) {
      // Перевод на карту по ID
      toCard = await Card.findByPk(toCardId, { transaction: t });
      if (!toCard) {
        await t.rollback();
        return res.status(404).send({ message: 'Карта получателя не найдена' });
      }
      transferTitle = 'Перевод на карту';
    } 
    else if (toCardNumber) {
      // Перевод по номеру карты
      toCard = await Card.findOne({ 
        where: { cardNumber: toCardNumber },
        transaction: t
      });
      if (!toCard) {
        await t.rollback();
        return res.status(404).send({ message: 'Карта получателя не найдена' });
      }
      transferTitle = 'Перевод по номеру карты';
    }
    else if (toPhoneNumber) {
      // Перевод по номеру телефона
      // Здесь нужно найти пользователя по телефону, а затем его карту
      // Для примера считаем, что перевод по телефону не реализован
      await t.rollback();
      return res.status(400).send({ message: 'Перевод по номеру телефона временно недоступен' });
    }
    else {
      await t.rollback();
      return res.status(400).send({ message: 'Не указан получатель перевода' });
    }
    
    // Обновление баланса исходной карты
    fromCard.cardBalance = parseFloat(fromCard.cardBalance) - parseFloat(amount);
    await fromCard.save({ transaction: t });
    
    // Создание транзакции для отправителя
    const senderTransaction = await Transaction.create({
      cardId: fromCardId,
      transactionDate: new Date(),
      amount: -amount,
      transactionType: 'transfer_out',
      transactionStatus: 'completed',
      comment
    }, { transaction: t });
    
    // Если карта получателя найдена, обновляем её баланс
    if (toCard) {
      toCard.cardBalance = parseFloat(toCard.cardBalance) + parseFloat(amount);
      await toCard.save({ transaction: t });
      
      // Создание транзакции для получателя
      await Transaction.create({
        cardId: toCard.id,
        transactionDate: new Date(),
        amount: amount,
        transactionType: 'transfer_in',
        transactionStatus: 'completed',
        comment
      }, { transaction: t });
    }
    
    // Фиксация транзакции в БД
    await t.commit();
    
    res.status(201).json({
      message: 'Перевод выполнен успешно',
      transaction: senderTransaction,
      newBalance: fromCard.cardBalance
    });
  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message });
  }
};

/**
 * Получение аналитики расходов по категориям
 */
exports.getCategoryAnalytics = async (req, res) => {
  try {
    const { cardId, period } = req.query;
    
    // Определяем дату начала периода
    const startDate = getStartDateByPeriod(period || 'month');
    
    // Базовый запрос для поиска транзакций
    const whereClause = {
      transactionDate: { [Op.gte]: startDate },
      amount: { [Op.lt]: 0 } // Только расходы (отрицательные суммы)
    };
    
    // Если указан ID карты, добавляем его в условие
    if (cardId) {
      whereClause.cardId = cardId;
      
      // Проверяем права доступа к карте
      const card = await Card.findOne({ 
        where: { id: cardId, userId: req.user.id } 
      });
      
      if (!card) {
        return res.status(404).send({ message: 'Карта не найдена' });
      }
    } else {
      // Иначе берем все карты пользователя
      const userCards = await Card.findAll({ 
        where: { userId: req.user.id },
        attributes: ['id']
      });
      
      const cardIds = userCards.map(card => card.id);
      whereClause.cardId = { [Op.in]: cardIds };
    }
    
    // Получаем транзакции
    const transactions = await Transaction.findAll({
      where: whereClause,
      attributes: [
        'transactionType',
        [sequelize.fn('SUM', sequelize.literal('ABS(amount)')), 'totalAmount']
      ],
      group: ['transactionType']
    });
    
    // Преобразуем результаты в удобный формат
    const result = transactions.map(t => ({
      name: getCategoryName(t.transactionType),
      amount: parseFloat(t.getDataValue('totalAmount')),
      category: t.transactionType
    }));
    
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Получение аналитики расходов по периодам
 */
exports.getPeriodAnalytics = async (req, res) => {
  try {
    const { cardId, period } = req.query;
    
    // Определяем временные интервалы в зависимости от периода
    const { startDate, intervals, format } = getTimeIntervalsForPeriod(period || 'month');
    
    // Базовый запрос для поиска транзакций
    const whereClause = {
      transactionDate: { [Op.gte]: startDate },
    };
    
    // Если указан ID карты, добавляем его в условие
    if (cardId) {
      whereClause.cardId = cardId;
      
      // Проверяем права доступа к карте
      const card = await Card.findOne({ 
        where: { id: cardId, userId: req.user.id } 
      });
      
      if (!card) {
        return res.status(404).send({ message: 'Карта не найдена' });
      }
    } else {
      // Иначе берем все карты пользователя
      const userCards = await Card.findAll({ 
        where: { userId: req.user.id },
        attributes: ['id']
      });
      
      const cardIds = userCards.map(card => card.id);
      whereClause.cardId = { [Op.in]: cardIds };
    }
    
    // Получаем транзакции с группировкой по периодам
    const transactions = await Transaction.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('date_trunc', format, sequelize.col('transaction_date')), 'period'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN amount > 0 THEN amount ELSE 0 END')), 'income'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END')), 'expense']
      ],
      group: [sequelize.fn('date_trunc', format, sequelize.col('transaction_date'))],
      order: [sequelize.fn('date_trunc', format, sequelize.col('transaction_date'))]
    });
    
    // Преобразуем результаты в удобный формат с заполнением пустых периодов
    const result = fillEmptyPeriods(transactions, intervals, format);
    
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getTransactionsByCardId = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверка прав доступа к карте
    const card = await Card.findOne({
      where: { id, userId: req.user.id }
    });

    if (!card) {
      return res.status(404).send({ message: 'Карта не найдена' });
    }

    // Получение всех транзакций для карты
    const transactions = await Transaction.findAll({
      where: { cardId: id },
      order: [['transactionDate', 'DESC']]
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// Вспомогательные функции
const getStartDateByPeriod = (period) => {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'quarter':
      return new Date(now.setMonth(now.getMonth() - 3));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case 'month':
    default:
      return new Date(now.setMonth(now.getMonth() - 1));
  }
};

const getTimeIntervalsForPeriod = (period) => {
  const now = new Date();
  let startDate, intervals, format;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      format = 'day';
      intervals = 7;
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      format = 'week';
      intervals = 13;
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      format = 'month';
      intervals = 12;
      break;
    case 'month':
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      format = 'day';
      intervals = 30;
      break;
  }
  
  return { startDate, intervals, format };
};

const fillEmptyPeriods = (transactions, intervals, format) => {
  // Это заглушка, в реальном приложении здесь будет логика заполнения пустых периодов
  return transactions.map(t => ({
    period: t.getDataValue('period'),
    income: parseFloat(t.getDataValue('income') || 0),
    expense: parseFloat(t.getDataValue('expense') || 0)
  }));
};

const getCategoryName = (transactionType) => {
  const categories = {
    'payment': 'Покупки',
    'withdrawal': 'Снятие наличных',
    'transfer_out': 'Переводы',
    'transfer_in': 'Поступления',
    'utility_payment': 'ЖКХ',
    'mobile_payment': 'Связь',
    'food_payment': 'Продукты',
    'transport_payment': 'Транспорт',
    'entertainment_payment': 'Развлечения'
  };
  
  return categories[transactionType] || 'Другое';
};