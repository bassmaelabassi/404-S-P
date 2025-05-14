const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, checkVerification } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.use(protect);
router.use(checkVerification);
router.get('/profile', userController.getProfile);
router.put(
  '/profile',
  [
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
  ],
  userController.updateProfile
);

module.exports = router;