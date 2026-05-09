const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      const err = new Error('Not authorized, token failed');
      err.statusCode = 401;
      next(err);
    }
  } else {
    const err = new Error('Not authorized, no token');
    err.statusCode = 401;
    next(err);
  }
};

// Middleware to restrict access based on role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error(`User role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route`);
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};

module.exports = { protect, authorize };
