const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').isMobilePhone().withMessage('Please enter a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  authController.register
);

router.post('/verify/:userId', authController.verify);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  authController.login
);
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please enter a valid email')],
  authController.forgotPassword
);
router.post(
  '/reset-password/:email',
  [
    body('code').exists().withMessage('Reset code is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  authController.resetPassword
);

module.exports = router;