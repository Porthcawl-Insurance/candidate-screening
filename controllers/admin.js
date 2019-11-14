const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const { JWT_SECRET, NODE_ENV } = process.env;
const jwtOptions = {
  expiresIn: NODE_ENV === 'dev' ? '7d' : '1h',
};

exports.postSignup = async (req, res) => {
  const { email, password } = req.query;

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) return res.status(409).send('Admin already exists with that email.');

  await Admin.create({ email, password });
  return res.send('Success');
};

exports.postLogin = async (req, res) => {
  const { email } = req.query;

  const admin = await Admin.findOne({ email });
  const token = jwt.sign({ email: admin.email, adminId: admin.id }, JWT_SECRET, jwtOptions);

  return res.json({ token });
};
