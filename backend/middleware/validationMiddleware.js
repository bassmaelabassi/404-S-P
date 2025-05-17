const { protect } = require('./authMiddleware');

const adminProtect = (req, res, next) => {
  protect(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    next();
  });
};

module.exports = { adminProtect };