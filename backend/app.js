// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const trashmenRoutes = require('./routes/trashmenRoutes');
const productsRoutes = require('./routes/productsRoutes');
const purchasedProductRoutes = require('./routes/purchasedProductRoutes');

const app = express();

app.use(cors({
    origin: '*',  // Allow your React app domain
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' })); // Increase limit to 50mb (adjust as needed)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json());
// Register routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/trashmen', trashmenRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/purchasedProduct', purchasedProductRoutes);
// app.use('/api/trashmen', trashmenRoutes);
// Global error-handling middleware
app.use((err, req, res, next) => {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "TokenExpiredError",
        message: "Your session has expired. Please log in again.",
      });
    }
});  
module.exports = app;
