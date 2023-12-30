const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  lineNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unqiue: true,
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
  },
  verified: {
    type: Boolean,
    required: true
  },
  admin: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);