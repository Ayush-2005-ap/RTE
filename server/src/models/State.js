const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A state must have a name'],
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'A state must have a slug'],
    unique: true,
    lowercase: true
  },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'UT']
  },
  complianceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  complianceLabel: {
    type: String,
    enum: ['High', 'Medium', 'Low', 'No Data'],
    default: 'No Data'
  },
  keyIssue: String,
  contactEmail: String,
  lastUpdated: Date
}, {
  timestamps: true
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
