const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error getting profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, phone } = req.body;
  const updates = {};
  const changeHistory = [];

  try {
    const user = await User.findById(req.user._id);
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      changeHistory.push({
        field: 'username',
        oldValue: user.username,
        newValue: username,
      });
      updates.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      changeHistory.push({
        field: 'email',
        oldValue: user.email,
        newValue: email,
      });
      updates.email = email;
      updates.isVerified.email = false;
    }

    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
      changeHistory.push({
        field: 'phone',
        oldValue: user.phone,
        newValue: phone,
      });
      updates.phone = phone;
      updates.isVerified.phone = false;
    }

    if (changeHistory.length === 0) {
      return res.status(400).json({ message: 'No changes detected' });
    }

    Object.assign(user, updates);
    user.changeHistory.push(...changeHistory);
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};