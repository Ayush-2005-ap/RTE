const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News must have a title'],
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'News must have a summary'],
    maxlength: [1000, 'Summary must be less or equal than 1000 characters']
  },
  body: {
    type: String  // Full article content (optional - can link externally)
  },
  source: {
    type: String,
    required: [true, 'News must have a source']
  },
  sourceUrl: {
    type: String,
    required: [true, 'News must have a source URL']
  },
  imageUrl: {
    type: String  // Cloudinary image URL
  },
  imagePublicId: {
    type: String  // Cloudinary public ID for deletion
  },
  state: {
    type: String,
    default: 'All India'
  },
  category: {
    type: String,
    enum: ['policy', 'infrastructure', 'teacher', 'curriculum', 'admission', 'funding', 'governance', 'other'],
    default: 'other'
  },
  publishedAt: {
    type: Date,
    required: [true, 'News must have a publication date'],
    default: Date.now
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  commentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

newsSchema.index({ state: 1, category: 1, publishedAt: -1 });
newsSchema.plugin(mongoosePaginate);

const News = mongoose.model('News', newsSchema);
module.exports = News;
