// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, profileUser, updateUser, getAllUsers , saveUser, deleteUser, addUser, updateUserFromBooking, updateUserCoin, forgotPassword, resetPassword} = require('../controllers/userController');
// const authenticateAdmin = require('../middleware/authenticateadmin');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', profileUser);
router.put('/updateUser', updateUser);
router.put('/updateUserCoins', updateUserCoin);
router.post('/updateUserFromBooking', updateUserFromBooking);

// Admin
router.get('/getAllUsers', getAllUsers);
router.put('/saveUser/:id', saveUser);
router.delete('/deleteUser/:id', deleteUser);

// Add User
router.post('/addUser', addUser)

//Forgot Pass
// Route to send reset password link
router.post('/forgot-password', forgotPassword);

// Route to reset the password
router.post('/reset-password', resetPassword);

module.exports = router;
