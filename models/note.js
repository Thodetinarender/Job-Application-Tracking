const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Application = require('./application');

const Note = sequelize.define('Note', {
  content: {
    type: DataTypes.TEXT,
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

module.exports = Note;