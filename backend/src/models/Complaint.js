const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['hostel', 'academic', 'infrastructure', 'other'],
    },
    priority: {
      type: String,
      required: [true, 'Please select a priority'],
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Pending', 'Resolved', 'Rejected'],
      default: 'Submitted',
    },
    duplicateCount: {
      type: Number,
      default: 0,
    },
    isRepeated: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        url: String,
        publicId: String,
        name: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
