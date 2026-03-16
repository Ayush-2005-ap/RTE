const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Discussion must have a title']
  },
  body: {
    type: String,
    required: [true, 'Discussion must have a body']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Discussion must belong to a user']
  },
  category: String,
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
