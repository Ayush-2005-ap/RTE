const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const stateContentSchema = new mongoose.Schema({
  state: {
    type: mongoose.Schema.ObjectId,
    ref: 'State',
    required: [true, 'Content must belong to a state']
  },
  category: {
    type: String,
    enum: ['acts-rules', 'reports', 'judgements', 'implementation', 'grievance-redressal', 'news']
  },
  title: {
    type: String,
    required: [true, 'Content must have a title']
  },
  date: Date,
  description: String,
  fileUrl: String,
  externalUrl: String,
  tags: [String],
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

stateContentSchema.index({ state: 1, category: 1 });
stateContentSchema.plugin(mongoosePaginate);

const StateContent = mongoose.model('StateContent', stateContentSchema);

module.exports = StateContent;
