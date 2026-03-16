const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    required: [true, 'Answer must belong to a question']
  },
  body: {
    type: String,
    required: [true, 'Answer must have a body'],
    maxlength: [10000, 'Body must be less or equal than 10000 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Answer must belong to a user']
  },
  upvotes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
