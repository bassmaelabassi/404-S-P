const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { generateCode } = require('../utils/codeGenerator');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email, phone, or username' });
    }
    const user = await User.create({ username, email, phone, password });
    const emailCode = generateCode();
    const smsCode = generateCode();

    user.verificationCode = emailCode;
    user.verificationCodeExpires = Date.now() + 3600000;
    await user.save();
    await sendEmail(email, 'Email Verification', `Your verification code is: ${emailCode}`);
    await sendSMS(phone, `Your verification code is: ${smsCode}`);

    res.status(201).json({
      message: 'User registered successfully. Verification codes sent.',
      userId: user._id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.verify = async (req, res) => {
  const { code } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    if (code.length === 6) {
      user.isVerified.email = true;
    } else {
      user.isVerified.phone = true;
    }

    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified.email || !user.isVerified.phone) {
      return res.status(403).json({
        message: 'Account not fully verified. Please verify your email and phone.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = generateCode();
    user.passwordResetCode = resetCode;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendEmail(email, 'Password Reset', `Your password reset code is: ${resetCode}`);

    res.status(200).json({ message: 'Password reset code sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during forgot password process' });
  }
};
exports.resetPassword = async (req, res) => {
  const { code, newPassword } = req.body;
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).select('+passwordResetCode');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordResetCode !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (user.passwordResetExpires < Date.now()) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};