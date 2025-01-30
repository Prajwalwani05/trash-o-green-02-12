// // db/dbConnection.js
// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD || '',{
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: false, // Disable SQL query logging
//     timezone: '+05:30',
//   }
// );

// module.exports = sequelize;
// db/dbConnection.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',{
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Disable SQL query logging
    timezone: '+05:30',
  }
);
// Second database connection (for example, for your additional database)
const sequelize2 = new Sequelize(
  process.env.DB2_NAME,
  process.env.DB2_USER,
  process.env.DB2_PASSWORD || '',
  {
    host: process.env.DB2_HOST,
    dialect: 'mysql',
    logging: false, // Disable SQL query logging
    timezone: '+05:30',
  }
);

module.exports = {sequelize, sequelize2};