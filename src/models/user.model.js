const { DataTypes } = require('sequelize');
const { db } = require('./../database/config');

const User = db.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('client', 'employee'),
    allowNull: false,
    defaultValue: 'client',
  },
  status: {
    type: DataTypes.ENUM('available', 'disabled'),
    allowNull: false,
    defaultValue: 'available',
  },
});

module.exports = User;
