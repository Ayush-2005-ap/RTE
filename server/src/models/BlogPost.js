const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post must have a title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  body: {
    type: String,
    required: [true, 'Blog post must have a body']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt must be less or equal than 500 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  featuredImage: {
    url: String,
    publicId: String
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: Date,
  commentCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1, publishedAt: -1 });

blogPostSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

blogPostSchema.plugin(mongoosePaginate);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;
