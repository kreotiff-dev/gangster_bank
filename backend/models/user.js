'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      User.hasMany(models.Token, { foreignKey: 'userId' });
    }
  }

  User.init({
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[0-9+\-() ]+$/i, // Пример регулярного выражения для проверки номера телефона
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    confirmCode: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true, // Automatically add createdAt and updatedAt
    underscored: true, // Use snake_case for automatically added attributes
  });

  return User;
};
