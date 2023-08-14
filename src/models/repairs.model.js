const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Repairs = db.define('repair', {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  motorsNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
});

const repairsStatus = Object.freeze({
  pending: 'pending',
  completed: 'completed',
  cancelled: 'cancelled',
});

module.exports = { Repairs, repairsStatus };
