const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { userId, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { userId: userId.toUpperCase() }] });

    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    // Create user
    const user = await User.create({
      userId,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        status: 'success',
        data: {
          _id: user._id,
          userId: user.userId,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      const error = new Error('Invalid user data');
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Check password
    if (user && (await user.matchPassword(password))) {
      res.json({
        status: 'success',
        data: {
          _id: user._id,
          userId: user.userId,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
