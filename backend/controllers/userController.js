// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register new user
const registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    const userId = decoded.userId;

    // Fetch user data by userId excluding the password using attributes
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclude the password field
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// User Profile
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


module.exports = { registerUser, loginUser, profileUser, updateUser };



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