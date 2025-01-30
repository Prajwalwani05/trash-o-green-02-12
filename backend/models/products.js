// models/booking.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../db/dbConnection');

const Products = sequelize.define('Products', {
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  marketPrice: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalPrice: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: 'products', // table name
  timestamps: true, // Automatically add createdAt and updatedAt columns
});

module.exports = Products;
