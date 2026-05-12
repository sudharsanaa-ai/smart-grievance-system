const User = require('../models/User');

// @desc    Auth user & get session
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { userId, email } = req.body;

    // Validate inputs
    if (!userId || !email) {
      return res.status(422).json({
        success: false,
        error: 'User ID and Email are required'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(422).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    const upperUserId = userId.trim().toUpperCase();

    // Validate prefix
    if (!upperUserId.startsWith('STU') && !upperUserId.startsWith('ADM')) {
      return res.status(422).json({
        success: false,
        error: 'Invalid User ID. Must start with STU (student) or ADM (admin)'
      });
    }

    // Determine role from userId prefix
    const role = upperUserId.startsWith('ADM') ? 'admin' : 'student';

    // Find or create user
    let user = await User.findOne({ userId: upperUserId });

    if (!user) {
      user = new User({
        userId: upperUserId,
        email: email.trim().toLowerCase(),
        role: role
      });
      await user.save();
    } else {
      // Update email if changed
      user.email = email.trim().toLowerCase();
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error during login'
    });
  }
};

module.exports = { login };
