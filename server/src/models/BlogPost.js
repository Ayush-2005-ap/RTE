const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post must have a title']
  },
  slug: {
    type: String,
    required: [true, 'Blog post must have a slug'],
    unique: true
  },
  body: {
    type: String,
    required: [true, 'Blog post must have a body']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt must be less or equal than 300 characters']
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
  publishedAt: Date
}, {
  timestamps: true
});

blogPostSchema.index({ slug: 1 }, { unique: true });

blogPostSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

blogPostSchema.plugin(mongoosePaginate);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
