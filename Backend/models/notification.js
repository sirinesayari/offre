const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'offre',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  type:{
    type:String,
    required:true,
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
