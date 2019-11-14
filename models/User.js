const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: String,
  city: String,
  state: String,
  zip: String,
  email: String,
  firstName: String,
  lastName: String,
}, { timestamps: true });

userSchema.index({ email: 1, firstName: 1, lastName: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
