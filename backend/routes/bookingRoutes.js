// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getBookings, getAllBookings, updateBookings, deleteBookings, cancelBooking, pickupBooking, updateBookingStatus } = require('../controllers/bookingController');
const router = express.Router();

router.post('/create', createBooking);
router.get('/all', getBookings);
router.put('/cancelBooking/:id', cancelBooking);

router.put('/pickupBooking', pickupBooking);
// Admin
router.get('/getAllBookings', getAllBookings);
router.put('/updateBookings/:id', updateBookings);
router.put('/updateBookingStatus/:id', updateBookingStatus);
router.delete('/deleteBookings/:id', deleteBookings);

module.exports = router;
