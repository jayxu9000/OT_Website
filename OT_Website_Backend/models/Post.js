// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  // Add timestamps to each post
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
