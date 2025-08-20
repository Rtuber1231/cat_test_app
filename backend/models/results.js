const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  testId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Test', 
    required: true 
  },
  userAnswers: {
    type: Map,
    of: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
  // You can add a score field here if you calculate it on the backend
  // score: { type: Number, required: true }
});

module.exports = mongoose.model('Result', resultSchema);
