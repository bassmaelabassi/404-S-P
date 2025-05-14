const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const checkVerification = (req, res, next) => {
  if (!req.user.isVerified.email || !req.user.isVerified.phone) {
    return res.status(403).json({
      message: 'Account not fully verified. Please verify your email and phone.',
    });
  }
  next();
};

module.exports = { protect, checkVerification };