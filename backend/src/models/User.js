const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    trim: true,
    uppercase: true, // E.g., STU123 or ADM456
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'user'],
    default: 'user',
  },
}, { timestamps: true });

// Pre-save middleware to assign role and hash password
userSchema.pre('save', async function (next) {
  // Assign role based on userId prefix
  if (this.isModified('userId') || this.isNew) {
    if (this.userId.startsWith('ADM')) {
      this.role = 'admin';
    } else if (this.userId.startsWith('STU')) {
      this.role = 'student';
    }
  }

  // Hash password if modified
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
