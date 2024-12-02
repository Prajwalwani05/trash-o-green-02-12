// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors({
    origin: '*',  // Allow your React app domain
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());
// Register routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;
