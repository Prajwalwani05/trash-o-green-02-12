const User = require('../models/User'); // Adjust the path based on your project structure
const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const fs = require('fs');
// Create a new booking
const createBooking = async (req, res) => {
  const { mobile, area, address, trashtype} = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!address || !mobile ||  !area) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    // Fetch user details based on userId
    const user = await User.findByPk(userId); // Adjust this query to match your ORM/DB setup
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Save booking to database
    const newBooking = await Booking.create({
      userId,
      name : user.name,
      mobile,
      area,
      address,
      trashtype,
      status: 'pending', 
    });

    // Prepare data for Excel
    const currentDateTime = new Date().toLocaleString();
    const requestData = [
      {
        Name: user.name,
        Mobile: mobile,
        Area: area,
        Address: address,
        TrashType: trashtype,
        'Booking Date & Time': currentDateTime,
        Status: 'pending',
      },
    ];

    const filePath = './data.xlsx';
    let workbook;

    if (fs.existsSync(filePath)) {
      // If the file exists, update it
      workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const existingData = xlsx.utils.sheet_to_json(sheet);
      existingData.push(requestData[0]);
      const updatedSheet = xlsx.utils.json_to_sheet(existingData);
      workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;
    } else {
      // If the file doesn't exist, create a new one
      workbook = xlsx.utils.book_new();
      const sheet = xlsx.utils.json_to_sheet(requestData);
      xlsx.utils.book_append_sheet(workbook, sheet, 'Requests');
    }

    // Write updated data to the file
    xlsx.writeFile(workbook, filePath);

    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token expired:', error);
      return res.status(401).json({ message: 'TokenExpired' }); // Specific message for frontend
    }

    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const bookings = await Booking.findAll({ where: { userId } });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

module.exports = { createBooking, getBookings };


// app.get('/api/bookings', authenticate, async (req, res) => {
//     try {
//         const bookings = await FormSubmission.find({ userId: req.userId });
//         res.status(200).json(bookings);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching bookings', error });
//     }
// });