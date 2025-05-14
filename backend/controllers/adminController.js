const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error getting users' });
  }
};

exports.getUserHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('changeHistory username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      changeHistory: user.changeHistory,
    });
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ message: 'Server error getting user history' });
  }
};

exports.adminUpdateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, phone, role } = req.body;
  const updates = {};
  const changeHistory = [];

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      changeHistory.push({
        field: 'username',
        oldValue: user.username,
        newValue: username,
        changedBy: req.user._id,
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
        changedBy: req.user._id,
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
        changedBy: req.user._id,
      });
      updates.phone = phone;
      updates.isVerified.phone = false;
    }

    if (role && role !== user.role) {
      changeHistory.push({
        field: 'role',
        oldValue: user.role,
        newValue: role,
        changedBy: req.user._id,
      });
      updates.role = role;
    }

    if (changeHistory.length === 0) {
      return res.status(400).json({ message: 'No changes detected' });
    }

    Object.assign(user, updates);
    user.changeHistory.push(...changeHistory);
    await user.save();

    res.status(200).json({
      message: 'User updated successfully by admin',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};