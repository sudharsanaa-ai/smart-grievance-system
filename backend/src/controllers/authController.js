const User = require('../models/User');

// @desc    Auth user & get session
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { userId, email } = req.body;

    // Simple manual validation to avoid middleware chain issues
    if (!userId || !email) {
      return res.status(422).json({
        success: false,
        error: 'User ID and Email are required'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(422).json({
        success: false,
        error: 'Please provide a valid email'
      });
    }

    const upperUserId = userId.toUpperCase();
    
    // Validate prefix
    if (!upperUserId.startsWith('STU') && !upperUserId.startsWith('ADM')) {
      return res.status(422).json({
        success: false,
        error: 'Invalid User ID format. Must start with STU or ADM'
      });
    }

    // Find user or create/update them to ensure email is stored for notifications
    let user = await User.findOne({ userId: upperUserId });

    if (!user) {
      user = await User.create({
        userId: upperUserId,
        email: email.toLowerCase()
      });
    } else {
      // Update email in case it changed
      user.email = email.toLowerCase();
      await user.save();
    }

    res.json({
      status: 'success',
      data: {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        role: user.role,
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
