require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'user') => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };