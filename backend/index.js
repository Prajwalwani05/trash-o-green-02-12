// const express = require('express');
// require('dotenv').config();
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// const xlsx = require('xlsx');
// const fs = require('fs');

// const app = express();

// // Middleware to parse JSON
// app.use(express.json());
// app.use(cors({
//     origin: '*',  // Allow your React app domain
//     methods: ['GET', 'POST', 'PUT'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// }));
// app.use(bodyParser.json());

// // MongoDB Atlas connection 
// const mongoURI = process.env.MONGO_URI;

// // Connect to MongoDB
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('Connected to MongoDB Atlas'))
//     .catch((err) => console.error('MongoDB Atlas connection error:', err));


//     // User Schema (for authentication)
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     mobile: { type: String, required: true },
//     password: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

// //  Define Booking Schema
// const formSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     name: { type: String, required: true },
//     mobile: { type: String, required: true },
//     area: { type: String, required: true },
//     address: { type: String, required: true },
//     bookingDateTime: { type: Date, default: Date.now },
// });

// // Define Mongoose Model
// const FormSubmission = mongoose.model('FormSubmission', formSchema);

// // Example route
// app.get('/', (req, res) => {
//     res.send('Connected to MongoDB Atlas!');
// });

// // Register new user (signup)
// app.post('/api/signup', async (req, res) => {
//     const { name, email, mobile, password } = req.body;

//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         const newUser = new User({ name, email, mobile, password: hashedPassword });
//         await newUser.save();
//         res.status(201).json({ message: 'User created successfully!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating user', error });
//     }
// });

// // Login user (authentication)
// // app.post('/api/login', async (req, res) => {
// //     const { email, password } = req.body;

// //     try {
// //         const user = await User.findOne({ email });
// //         if (!user) return res.status(400).json({ message: 'User not found' });

// //         const isPasswordValid = await bcrypt.compare(password, user.password);
// //         if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

// //         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //         res.status(200).json({ token });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error logging in', error });
// //     }
// // });
// // Login user (authentication)
// app.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if the user exists by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'User not found. Please check your email or register.' });
//         }

//         // Check if the password is correct
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ message: 'Invalid credentials. Please check your password.' });
//         }

//         // Create a JWT token for the user
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Send the token to the client
//         return res.status(200).json({ token });

//     } catch (error) {
//         console.error('Login error:', error);
//         return res.status(500).json({ message: 'Error logging in. Please try again later.' });
//     }
// });


// // Middleware to verify JWT
// const authenticate = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(403).json({ message: 'Token required' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return res.status(401).json({ message: 'Invalid or expired token' });
//         req.userId = decoded.userId;
//         next();
//     });
// };

// // Get user profile (requires authentication)
// app.get('/api/profile', authenticate, async (req, res) => {
//     try {
//         const user = await User.findById(req.userId).select('-password'); // Exclude password
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         console.error('Error fetching profile:', error);
//         res.status(500).json({ message: 'Error fetching profile', error });
//     }
// });

// // Update user profile (requires authentication)
// app.put('/api/profile', authenticate, async (req, res) => {
//     const { name, email, mobile } = req.body;

//     try {
//         const user = await User.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update fields only if provided
//         if (name) user.name = name;
//         if (email) user.email = email;
//         if (mobile) user.mobile = mobile;

//         await user.save();
//         res.status(200).json({ message: 'Profile updated successfully', user });
//     } catch (error) {
//         console.error('Error updating profile:', error);
//         res.status(500).json({ message: 'Error updating profile', error });
//     }
// });


// // Get user bookings (requires authentication)
// app.get('/api/bookings', authenticate, async (req, res) => {
//     try {
//         const bookings = await FormSubmission.find({ userId: req.userId });
//         res.status(200).json(bookings);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching bookings', error });
//     }
// });


// // Endpoint to handle form submission
// app.post('/api/submit-request', authenticate, async (req, res) => {
//     const { name, mobile, area, address } = req.body;
    
//     if (!name || !address || !mobile || !area) {
//         return res.status(400).json({ message: 'All fields are required.' });
//     }

//     try {
//         // Save to MongoDB
//         const newSubmission = new FormSubmission({
//             userId: req.userId,
//             name, mobile, area, address 
//         });
//         await newSubmission.save();

//         // Get current date and time
//         const currentDateTime = new Date().toLocaleString();

//         // Prepare data to save to .xlsx
//         const requestData = [
//             {
//                 Name: name,
//                 Mobile: mobile,
//                 Area: area,
//                 Address: address,
//                 "Booking Date & Time": currentDateTime,
//             },
//         ];

//         // Check if data.xlsx exists, if not, create it
//         const filePath = './data.xlsx';
//         let workbook;

//         if (fs.existsSync(filePath)) {
//             // If the file exists, update it
//             workbook = xlsx.readFile(filePath);
//             const sheet = workbook.Sheets[workbook.SheetNames[0]];
//             const existingData = xlsx.utils.sheet_to_json(sheet);
//             existingData.push(requestData[0]);
//             const updatedSheet = xlsx.utils.json_to_sheet(existingData);
//             workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;
//         } else {
//             // If the file doesn't exist, create a new one
//             workbook = xlsx.utils.book_new();
//             const sheet = xlsx.utils.json_to_sheet(requestData);
//             xlsx.utils.book_append_sheet(workbook, sheet, 'Requests');
//         }

//         // Write the updated data to the file
//         xlsx.writeFile(workbook, filePath);

//         res.status(200).json({ message: 'Request submitted successfully!' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Failed to save the request.' });
//     }
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// server.js
const app = require('./app');
const sequelize = require('./db/dbConnection');

// Start the server and sync with the database
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync(); // Sync models with the database
    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

startServer();
