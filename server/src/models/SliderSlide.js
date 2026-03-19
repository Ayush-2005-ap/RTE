const mongoose = require('mongoose');

const sliderSlideSchema = new mongoose.Schema({
  order: {
    type: Number,
    default: 0
  },
  leftImageUrl: {
    type: String,
    required: [true, 'Slide must have a left image']
  },
  leftImagePublicId: {
    type: String  // Cloudinary public ID for deletion
  },
  leftCategory: {
    type: String,
    required: [true, 'Slide must have a category'],
    trim: true
  },
  leftReadTime: {
    type: String,
    default: '3 Min Read'
  },
  leftTitle: {
    type: String,
    required: [true, 'Slide must have a title'],
    trim: true
  },
  leftDesc: {
    type: String,
    required: [true, 'Slide must have a description'],
    maxlength: [600, 'Description must be less or equal than 600 characters']
  },
  leftLink: {
    type: String,
    default: '#'
  },
  rightLabel: {
    type: String,
    required: [true, 'Slide must have a right panel label'],
    trim: true
  },
  rightTitle: {
    type: String,
    required: [true, 'Slide must have a right panel title'],
    trim: true
  },
  rightDesc: {
    type: String,
    required: [true, 'Slide must have a right panel description'],
    maxlength: [600, 'Description must be less or equal than 600 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

sliderSlideSchema.index({ order: 1, isActive: 1 });

const SliderSlide = mongoose.model('SliderSlide', sliderSlideSchema);
module.exports = SliderSlide;
