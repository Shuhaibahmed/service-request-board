const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    location: { type: String },
    contactName: { type: String },
    contactEmail: {
      type: String,
      validate: {
        validator: (value) =>
          !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Invalid email format'
      }
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobRequest', jobRequestSchema);
