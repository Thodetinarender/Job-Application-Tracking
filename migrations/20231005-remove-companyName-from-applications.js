'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Applications', 'companyName');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Applications', 'companyName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
