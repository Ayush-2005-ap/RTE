const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new mongoose.Schema({
  contentType: {
    type: String,
    enum: ['blog', 'news'],
    required: [true, 'Comment must have a content type']
  },
  contentId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Comment must belong to a content item'],
    refPath: 'contentType'
  },
  authorName: {
    type: String,
    required: [true, 'Please provide a display name'],
    trim: true,
    maxlength: [60, 'Name must be less or equal than 60 characters']
  },
  body: {
    type: String,
    required: [true, 'Comment must have a body'],
    maxlength: [2000, 'Comment must be less or equal than 2000 characters']
  },
  isApproved: {
    type: Boolean,
    default: true  // Auto-approve; admin can delete
  }
}, {
  timestamps: true
});

commentSchema.index({ contentType: 1, contentId: 1, createdAt: -1 });
commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
