'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tokens', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Здесь можно добавить код для восстановления данных, если необходимо
  }
};
