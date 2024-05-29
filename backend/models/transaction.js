'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    amount: {
      type: DataTypes.NUMERIC,
      allowNull: true
    },
    transactionType: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    timestamps: true,
    underscored: true, 
  });
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Card, { foreignKey: 'cardId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return Transaction;
};
