const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A question must have a title'],
    maxlength: [200, 'Title must be less or equal than 200 characters']
  },
  body: {
    type: String,
    required: [true, 'A question must have a body'],
    maxlength: [5000, 'Body must be less or equal than 5000 characters']
  },
  authorName: {
    type: String,
    default: 'Anonymous',
    maxlength: [60, 'Name must be less or equal than 60 characters']
  },
  state: {
    type: String,
    default: 'All India'
  },
  category: {
    type: String,
    enum: ['25-reservation', 'admissions', 'teachers', 'curriculum', 'infrastructure', 'mid-day-meal', 'recognition', 'budget', 'other']
  },
  tags: {
    type: [String],
    validate: [val => val.length <= 5, 'You can have at most 5 tags']
  },
  upvoteCount: {
    type: Number,
    default: 0
  },
  answerCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'answered', 'closed'],
    default: 'open'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

questionSchema.index({ state: 1, category: 1, status: 1 });
questionSchema.index({ createdAt: -1 });

questionSchema.plugin(mongoosePaginate);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
