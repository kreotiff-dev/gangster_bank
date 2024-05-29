'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cardLimit: {
      type: DataTypes.NUMERIC,
      allowNull: true
    },
    cardBalance: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    lastUsageDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cardCategory: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cardStatus: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    cardNumber: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    securityParams: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cvv: {
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
    cardType: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Card',
    timestamps: true,
    underscored: true,
  });
  Card.associate = function(models) {
    // associations can be defined here
    Card.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return Card;
};
