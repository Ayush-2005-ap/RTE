const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Publication must have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Publication must have a description'],
    maxlength: [1000, 'Description must be less or equal than 1000 characters']
  },
  pdfUrl: {
    type: String,
    required: [true, 'Publication must have a PDF file']
  },
  pdfPath: {
    type: String  // Supabase storage path for deletion
  },
  thumbnailUrl: {
    type: String  // Optional cover image (Cloudinary)
  },
  thumbnailPublicId: {
    type: String  // Cloudinary public ID for deletion
  },
  category: {
    type: String,
    enum: ['policy', 'report', 'research', 'guideline', 'circular', 'other'],
    default: 'other'
  },
  tags: [String],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

publicationSchema.index({ category: 1, publishedAt: -1 });
publicationSchema.plugin(mongoosePaginate);

const Publication = mongoose.model('Publication', publicationSchema);
module.exports = Publication;
