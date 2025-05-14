const { body } = require('express-validator');

const registerValidations = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone').isMobilePhone().withMessage('Please enter a valid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidations = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required'),
];

const updateProfileValidations = [
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
];

module.exports = {
  registerValidations,
  loginValidations,
  updateProfileValidations,
};