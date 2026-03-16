const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News must have a title']
  },
  summary: {
    type: String,
    required: [true, 'News must have a summary'],
    maxlength: [600, 'Summary must be less or equal than 600 characters']
  },
  source: {
    type: String,
    required: [true, 'News must have a source']
  },
  sourceUrl: {
    type: String,
    required: [true, 'News must have a source URL']
  },
  state: {
    type: String,
    default: 'All India'
  },
  category: String,
  publishedAt: {
    type: Date,
    required: [true, 'News must have a publication date']
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

newsSchema.index({ state: 1, category: 1, publishedAt: -1 });
newsSchema.plugin(mongoosePaginate);

const News = mongoose.model('News', newsSchema);

module.exports = News;
