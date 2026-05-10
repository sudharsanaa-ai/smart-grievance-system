const User = require('../models/User');

// @desc    Auth user & get session
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      const error = new Error('User ID is required');
      error.statusCode = 400;
      throw error;
    }

    const upperUserId = userId.toUpperCase();
    
    // Validate prefix
    if (!upperUserId.startsWith('STU') && !upperUserId.startsWith('ADM')) {
      const error = new Error('Invalid User ID format. Must start with STU or ADM');
      error.statusCode = 400;
      throw error;
    }

    // Find user or create a demo user on the fly if it starts with STU or ADM
    let user = await User.findOne({ userId: upperUserId });

    if (!user) {
      // For demo purposes, we automatically create the user if the ID is valid prefix-wise
      user = await User.create({
        userId: upperUserId
      });
    }

    res.json({
      status: 'success',
      data: {
        _id: user._id,
        userId: user.userId,
        role: user.role,
        // No token needed for this simplified version, using userId as identifier
        token: user.userId 
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
