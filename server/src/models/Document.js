const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document must have a title']
  },
  fileUrl: {
    type: String,
    required: [true, 'Document must have a file URL']
  },
  fileType: String,
  fileSize: Number,
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  associatedState: {
    type: mongoose.Schema.ObjectId,
    ref: 'State'
  },
  category: String
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
