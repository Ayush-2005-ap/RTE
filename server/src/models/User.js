const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
    maxlength: [60, 'A user name must have less or equal than 60 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false
  },
  role: {
    type: String,
    enum: ['citizen', 'moderator', 'admin'],
    default: 'citizen'
  },
  userType: {
    type: String,
    enum: ['parent', 'teacher', 'student', 'ngo', 'researcher', 'other']
  },
  state: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    select: false
  },
  verifyTokenExpiry: {
    type: Date,
    select: false
  },
  resetToken: {
    type: String,
    select: false
  },
  resetTokenExpiry: {
    type: Date,
    select: false
  },
  refreshTokenHash: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
