'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      // Define associations here
      Token.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Token.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens',
    timestamps: true,
    underscored: true,
  });

  return Token;
};
