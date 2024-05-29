const { Transaction } = require('../models');

exports.getTransactionsByCardId = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { cardId: req.params.id } });
    res.json(transactions);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
