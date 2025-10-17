const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['comment', 'reply', 'mention', 'like','appointment'],
    default: 'comment'
  },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  message: { type: String, required: true },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: false
  },
  postTitle: {
    type: String,
    required: false
  },
  commentContent: {
    type: String,
    required: false,
    maxlength: 200 // Store truncated version for notification
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient querying of user notifications
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

