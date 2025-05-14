const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminProtect } = require('../middlewares/adminMiddleware');
const { body } = require('express-validator');

router.use(adminProtect);
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/history', adminController.getUserHistory);
router.put(
  '/users/:userId',
  [
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  ],
  adminController.adminUpdateUser
);

module.exports = router;