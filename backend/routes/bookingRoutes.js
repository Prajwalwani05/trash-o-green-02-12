// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getBookings } = require('../controllers/bookingController');
const router = express.Router();

router.post('/create', createBooking);
router.get('/all', getBookings);

module.exports = router;
