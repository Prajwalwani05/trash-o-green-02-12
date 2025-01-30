// models/booking.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("../db/dbConnection");

const PurchasedProduct = sequelize.define(
  "PurchasedProduct",
  {
    userId: {
      type: DataTypes.INTEGER,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userMobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productName: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    productImage: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    originalPrice: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    buyingPrice: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    tableName: "purchasedProduct", // table name
    timestamps: true, // Automatically add createdAt and updatedAt columns
  }
);

module.exports = PurchasedProduct;
