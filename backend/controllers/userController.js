// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Trashman = require('../models/trashman');
const Booking = require('../models/booking');
const nodemailer = require('nodemailer');

// Register new user
const registerUser = async (req, res) => {
  console.log('Request body:', req.body); // Log the incoming request body
  const { name, email, mobile, password } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword); // Log hashed password

      const newUser = await User.create({
          name,
          email,
          mobile,
          password: hashedPassword,
          coins: 0,
          area: '',
          address: '',
          role: 'user'
      });

      console.log('New user created:', newUser); // Log the created user
      const token = jwt.sign({ userRole: newUser.role,  coins: newUser.coins, userId: newUser.id, userEmail: newUser.email, userMobile: newUser.mobile, userName: newUser.name, userArea: newUser.area, userAddress: newUser.address }, process.env.JWT_SECRET, { expiresIn: '1h' });
      // Send the token along with the success message
      res.status(200).json({
        message: 'User created successfully!',
        user: newUser,
        token: token // Send the token in the response
      });
  } catch (error) {
      console.error('Error creating user:', error); // Log errors
      res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ where: { mobile } });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userRole: user.role, coins: user.coins, userId: user.id, userEmail: user.email, userMobile: user.mobile, userName: user.name, area: user.area, address: user.address }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// User Profile
const profileUser = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
    where: { id: decoded.userId },
    attributes: { exclude: ['password'] },
  });

  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Update Profile
const updateUser = async (req, res) => {
  const { name, email, mobile } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user data by userId excluding the password using attributes
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclude the password field
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (name) user.name = name;
            if (email) user.email = email;
            if (mobile) user.mobile = mobile;
    
            await user.save();
            res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

// Update Profile
const updateUserCoin = async (req, res) => {
  const { coins } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  // Check if the token is provided
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user data by userId excluding the password using attributes
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclude the password field
    });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Ensure that coins is a valid number
    if (coins !== undefined && coins !== null && !isNaN(coins)) {
      user.coins = coins; // Update coins
      await user.save(); // Save user with updated coins
      return res.status(200).json({ user }); // Send updated user data back
    } else {
      return res.status(400).json({ message: 'Invalid coins value' }); // Coins value is invalid
    }

  } catch (error) {
    console.error('Error updating coins:', error);
    return res.status(500).json({ message: 'Error updating coins', error });
  }
};


// Controller function to update user from booking
const updateUserFromBooking = async (userId, address, area) => {
  try {
    const result = await User.update(
      { address, area },
      { where: { id: userId } }
    );
    return result; // Return result instead of sending a response
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Throw the error to handle it in the calling function
  }
};



//  Admin
// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};



const saveUser = async (req, res) => {
  console.log(req.body.name); // Logs the data sent in the body of the request
  const { id, role, name, email, mobile } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (name) user.name = name;
            if (email) user.email = email;
            if (mobile) user.mobile = mobile;
            if (role) user.role = role;
            await user.save();


    // If the role is 'trashman', check if a trashman entry exists
    if (role === 'Trashman') {
      // Check if a trashman record exists for this user
      let trashman = await Trashman.findOne({ where: { mobile: user.mobile } });

      // If the trashman record doesn't exist, create one
      if (!trashman) {
        trashman = await Trashman.create({
          // user_id: user.id,
          role,
          name,
          email,
          mobile,
          password: user.password,
          area: user.area,
          address:user.address,
          status: 'active', // You can set the initial status to 'active'
        });
      }

      // Send the response with both user and trashman details
      return res.status(200).json({
        message: 'User role updated to trashman and trashman details created.',
        user,
        trashman,
      });
    }

            res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }

};


// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
   
    // Fetch user data by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Add new user
const addUser = async(req, res) => {
  const { name, email, mobile, password, role } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword); // Log hashed password

      const newUser = await User.create({
          name,
          email,
          mobile,
          password: hashedPassword,
          role
      });

      res.status(200).json({ message: 'User Added successfully' });
  } catch (error) {
      console.error('Error creating user:', error); // Log errors
      res.status(500).json({ message: 'Error creating user', error });
  }
}


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Request body:', req.body); // Log the request body
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Hello, \n\nYou requested to reset your password. Please click the following link to reset your password: \n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending reset email', error });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Password reset link sent to your email' });
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error sending reset email', error: error.message });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error });
  }
};


module.exports = { registerUser, loginUser, profileUser, updateUser, getAllUsers, saveUser, deleteUser, addUser, updateUserFromBooking , updateUserCoin, forgotPassword, resetPassword};
