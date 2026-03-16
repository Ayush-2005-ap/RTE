const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const grievanceSchema = new mongoose.Schema({
  refNumber: {
    type: String,
    unique: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Grievance must belong to a user']
  },
  userType: {
    type: String,
    enum: ['parent', 'teacher', 'student', 'ngo', 'other']
  },
  state: {
    type: String,
    required: [true, 'Please provide the state']
  },
  category: {
    type: String,
    enum: ['admission-denial', 'fee-issue', 'infrastructure', 'teacher-shortage', 'mid-day-meal', 'discrimination', 'other'],
    required: [true, 'Please provide a category']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [5000, 'Description must be less or equal than 5000 characters']
  },
  attachments: [
    {
      url: String,
      publicId: String,
      filename: String
    }
  ],
  status: {
    type: String,
    enum: ['filed', 'reviewing', 'resolved', 'escalated'],
    default: 'filed'
  },
  adminNotes: [
    {
      note: String,
      addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

grievanceSchema.pre('save', function() {
  if (!this.isNew) return;
  
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  this.refNumber = `RTE-${year}-${randomChars}`;
});

grievanceSchema.index({ author: 1, status: 1 });
grievanceSchema.index({ refNumber: 1 }, { unique: true });

grievanceSchema.plugin(mongoosePaginate);

const Grievance = mongoose.model('Grievance', grievanceSchema);

module.exports = Grievance;
