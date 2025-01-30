// routes/userRoutes.js
const express = require('express');
const { getAllTrashmen, updateTrashmen, deleteTrashmen, assignedTrashman } = require('../controllers/trashmanController');
// const authenticateAdmin = require('../middleware/authenticateadmin');
const router = express.Router();

// Trashman
router.get('/getAllTrashmen', getAllTrashmen);
router.put('/updateTrashmen/:id', updateTrashmen);
router.delete('/deleteTrashmen/:id', deleteTrashmen);
router.get('/assignedTrashmen', assignedTrashman);


module.exports = router;
