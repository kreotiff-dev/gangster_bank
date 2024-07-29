'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cardId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      amount: {
        type: Sequelize.NUMERIC,
        allowNull: true
      },
      transactionType: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      transactionStatus: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};
