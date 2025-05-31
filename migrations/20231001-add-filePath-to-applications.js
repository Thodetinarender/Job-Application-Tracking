'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Applications', 'companyId'); // Remove companyId column
        await queryInterface.addColumn('Applications', 'filePath', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Applications', 'filePath');
        await queryInterface.addColumn('Applications', 'companyId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Companies',
                key: 'id',
            },
        });
    },
};
