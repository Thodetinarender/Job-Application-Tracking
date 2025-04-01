const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Application = require('./application');

const Reminder = sequelize.define('Reminder', {
  reminderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  applicationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Application,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

module.exports = Reminder;