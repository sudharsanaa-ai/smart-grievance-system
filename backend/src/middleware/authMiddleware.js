const User = require('../models/User');

const protect = async (req, res, next) => {
  let userId;

  if (req.headers['x-user-id']) {
    userId = req.headers['x-user-id'];
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Fallback for some clients that might still use Bearer <userId>
    userId = req.headers.authorization.split(' ')[1];
  }

  if (userId) {
    try {
      // Find user by userId
      const user = await User.findOne({ userId: userId.toUpperCase() });

      if (!user) {
        const err = new Error('Not authorized, user not found');
        err.statusCode = 401;
        return next(err);
      }

      req.user = user;
      next();
    } catch (error) {
      const err = new Error('Not authorized, session failed');
      err.statusCode = 401;
      next(err);
    }
  } else {
    const err = new Error('Not authorized, no user ID provided');
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
