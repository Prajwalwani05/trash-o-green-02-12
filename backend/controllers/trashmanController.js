// controllers/userController.js
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Trashman = require('../models/trashman');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Booking = require('../models/booking');

const storage = multer.memoryStorage(); // Store files in memory (as buffer)

const upload = multer({ storage: storage }).single('document'); // Handle single file upload

const getAllTrashmen = async (req, res) => {
    try {
      const users = await Trashman.findAll({
        attributes: { exclude: ['password'] }
      });
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching trashmen', error });
    }
  };

  const updateTrashmen = async (req, res) => {
    console.log(req.body.name); // Logs the data sent in the body of the request
    const { id, role, name, email, mobile, area, address, status, document } = req.body;
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
  
    
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }
  
    try {
      // Multer middleware to handle file upload (binary data in memory)
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err });
      }
      const trashman = await Trashman.findByPk(id);
  
      if (!trashman) {
        return res.status(400).json({ message: 'Trashman not found' });
      }
  
      if (name) trashman.name = name;
              if (email) trashman.email = email;
              if (mobile) trashman.mobile = mobile;
              if (role) trashman.role = role;
              if (area) trashman.area = area;
              if (address) trashman.address = address;
              if (status) trashman.status = status;
              // Check if a new document was uploaded and update the document field with binary data
              // Check if a new document was uploaded and update the document field with binary data
      if (req.file) {
        trashman.document = req.file.buffer; // Store the uploaded file's binary data
      }
              // Save the updated trashman profile
              await trashman.save();
              res.status(200).json({ message: 'Profile updated successfully', trashman });
            })
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile', error });
    }
  
  };

  // Delete Trashmen
const deleteTrashmen = async (req, res) => {
  const { id } = req.params;
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
   
    // Fetch user data by ID
    const trashman = await Trashman.findByPk(id);

    if (!trashman) {
      return res.status(400).json({ message: 'Trashman not found' });
    }
    // Delete the user
    await trashman.destroy();

    res.status(200).json({ message: 'Trashman deleted successfully' });
  } catch (error) {
    console.error('Error deleting Trashman:', error);
    res.status(500).json({ message: 'Error deleting Trashman', error });
  }
};

const assignedTrashman = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and extract the user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userMobile = decoded.userMobile;

    // Find trashman based on the userMobile (from the decoded token)
    const trashman = await Trashman.findOne({
      where: { mobile: userMobile }, // Using the decoded userMobile to find the trashman
    });

    if (!trashman) {
      return res.status(404).json({ message: 'Trashman not found' });
    }

    // Get bookings associated with the trashmanId
    const bookings = await Booking.findAll({
      where: { trashmanId: trashman.trashmanId },  // Assuming trashmanId is the correct field to filter
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this trashman' });
    }

    return res.status(200).json({ bookings });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

  module.exports = { getAllTrashmen, updateTrashmen, deleteTrashmen , assignedTrashman};
