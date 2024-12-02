// models/booking.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnection');
const moment = require('moment-timezone');

const Booking = sequelize.define('Booking', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trashtype: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'canceled'),  // Predefined list of statuses
    allowNull: false,
    defaultValue: 'pending',  // Default status is "pending"
  },



}, {
  tableName: 'bookings', // table name
  timestamps: true, // Automatically add createdAt and updatedAt columns
});

module.exports = Booking;
