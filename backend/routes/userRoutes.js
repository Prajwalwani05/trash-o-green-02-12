// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, profileUser, updateUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', profileUser);
router.put('/updateUser', updateUser);

module.exports = router;
