// models/booking.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../db/dbConnection');
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
  calculatedWeight: {
    type: DataTypes.JSON,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:'Not Paid'
  },  
  // amount: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  assignedTrashman: {
    type: DataTypes.STRING,
    defaultValue:'Not Assigned',
    allowNull: true
  },
  trashmanId: {
    type: DataTypes.STRING,
    defaultValue:'Not Assigned',
    allowNull: true
  },
  pickUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Approval Pending', 'InProgress', 'Completed', 'Cancelled'),  // Predefined list of statuses
    allowNull: false,
    defaultValue: 'Approval Pending',  // Default status is "pending"
  },
  

}, {
  tableName: 'bookings', // table name
  timestamps: true, // Automatically add createdAt and updatedAt columns
});

module.exports = Booking;
