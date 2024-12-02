// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnection');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users', // table name
  timestamps: true, // Automatically add createdAt and updatedAt columns
});

module.exports = User;
