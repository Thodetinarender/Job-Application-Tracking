'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Applications', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies', // Ensure this matches the table name in the database
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Applications', 'companyId');
  },
};
