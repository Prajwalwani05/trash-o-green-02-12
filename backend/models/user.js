// models/user.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../db/dbConnection');

const User = sequelize.define('User', {
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    // unique: true,
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coins: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
 
  address: { // New field
    type: DataTypes.STRING,
    allowNull: true,
  },
  area: { // New field
    type: DataTypes.STRING,
    allowNull: true,
  },
  
}, {
  tableName: 'users', // table name
  timestamps: true, // Automatically add createdAt and updatedAt columns
});

module.exports = User;
