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
  authorName: {
    type: String,
    default: 'Anonymous',
    maxlength: [60, 'Name must be less or equal than 60 characters']
  },
  upvoteCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false  // Admin can mark as verified/helpful
  }
}, {
  timestamps: true
});

answerSchema.index({ questionId: 1, createdAt: -1 });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
