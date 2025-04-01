const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Company = require('./company');

const Application = sequelize.define('Application', {
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('applied', 'interviewed', 'offered', 'rejected'),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  filePath: {
    type: DataTypes.STRING, // Store the file path of uploaded documents
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  companyId: {
    type: DataTypes.INTEGER,
    references: {
      model: Company,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

Application.belongsTo(User, { foreignKey: 'userId' }); // Ensure association with User
Application.belongsTo(Company, { foreignKey: 'companyId' }); // Ensure association with Company

module.exports = Application;