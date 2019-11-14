const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
}, { timestamps: true });

adminSchema.pre('save', function save(next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);

    this.password = hash;
    return next();
  });
});

adminSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
