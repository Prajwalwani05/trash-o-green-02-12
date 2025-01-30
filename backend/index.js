const app = require('./app');
const {sequelize, sequelize2} = require('./db/dbConnection');
const startServer = async () => {
  try {
    // Authenticate and connect to the database
    await sequelize.authenticate();
    console.log('Database connected!');

    await sequelize2.authenticate();
    console.log('Database 2 connected')
    // Sync models with the database and handle schema updates
    await sequelize.sync({
      alter: true  // Automatically alter the schema as needed
    });

    // Start the server
    app.listen(5000, '0.0.0.0', () => console.log('Server running on port 5000'));
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

startServer();
// // Start the server and sync with the database
// const startServer = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected!');
//     await sequelize.sync(); // Sync models with the database
    
    
//     app.listen(5000, '0.0.0.0', () => console.log('Server running on port 5000'));
//   } catch (error) {
//     console.error('Database connection failed:', error);
//   }
// };

// startServer();
