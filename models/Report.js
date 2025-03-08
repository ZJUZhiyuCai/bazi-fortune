const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  birthTime: {
    type: Date,
    required: true
  },
  analysis: {
    pillars: {
      year: String,
      month: String,
      day: String,
      time: String
    },
    elements: {
      wood: Number,
      fire: Number,
      earth: Number,
      metal: Number,
      water: Number
    },
    scores: {
      health: Number,
      wealth: Number,
      love: Number
    },
    advice: {
      health: [String],
      wealth: [String],
      love: [String]
    },
    suitable: [String],
    unsuitable: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);