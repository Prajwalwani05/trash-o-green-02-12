const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    console.log('Decoded token:', decoded); // Debugging step
    const user = await User.findByPk(decoded.userId); // Find user by ID

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' }); // Forbidden if not admin
    }

    req.userId = user.id; // Attach user ID to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error', error);
    res.status(500).json({ message: 'Error verifying token', error });
  }
};

module.exports = authenticateAdmin;
