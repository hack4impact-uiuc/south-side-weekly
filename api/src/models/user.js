const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: { type: String },
});

module.exports = mongoose.model('User', User);
