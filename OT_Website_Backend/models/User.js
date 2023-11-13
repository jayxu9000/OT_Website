const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    contentType: String,
    required: false
  },
  linkedIn: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);