const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    unique: true
  },
  category: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  }
});

module.exports = Product;