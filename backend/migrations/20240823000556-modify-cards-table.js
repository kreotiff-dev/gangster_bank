'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cardLimit: {
        type: Sequelize.NUMERIC,
        allowNull: true
      },
      cardBalance: {
        type: Sequelize.NUMERIC,
        allowNull: false
      },
      lastUsageDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        onUpdate: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        onUpdate: Sequelize.fn('NOW')
      },
      cardCategory: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      cardStatus: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      cardNumber: {
        type: Sequelize.STRING(16),
        allowNull: false
      },
      securityParams: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      cvv: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      cardholderFirstname: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      cardholderLastname: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      cardType: {
        type: Sequelize.STRING(20),
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cards');
  }
};
