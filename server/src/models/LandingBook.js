const mongoose = require('mongoose');

const landingBookSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
    default: 0
  },
  type: {
    type: String,
    enum: ['contents', 'chapter'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Book section must have a title']
  },
  desc: {
    type: String
  },
  items: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const LandingBook = mongoose.model('LandingBook', landingBookSchema);

module.exports = LandingBook;
