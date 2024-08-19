'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CardRequest extends Model {
    static associate(models) {
      CardRequest.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      CardRequest.belongsTo(models.Card, { foreignKey: 'cardId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
    }
  }

  CardRequest.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cardType: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cardCategory: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cardBalance: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    cardholderFirstname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cardholderLastname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'In Progress'
    }
  }, {
    sequelize,
    modelName: 'CardRequest',
    timestamps: true,
    underscored: true,
  });

  return CardRequest;
};
