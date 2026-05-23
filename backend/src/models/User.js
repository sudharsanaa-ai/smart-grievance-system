const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
}, { timestamps: true });

// Pre-save middleware to assign role based on userId prefix
userSchema.pre('save', function () {
  if (this.isModified('userId') || this.isNew) {
    if (this.userId.startsWith('ADM')) {
      this.role = 'admin';
    } else if (this.userId.startsWith('STU')) {
      this.role = 'student';
    }
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
