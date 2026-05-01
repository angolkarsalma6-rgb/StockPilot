const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  current_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  acknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Alert;