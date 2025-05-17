const User = require("../models/User");
const ChangeLog = require("../models/ChangeLog");
const { validationResult } = require("express-validator");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

  const { username, email, phone } = req.body;
  const changes = [];

  if (username && username !== user.username) {
    changes.push({ field: "username", oldValue: user.username, newValue: username });
    user.username = username;
  }

  if (email && email !== user.email) {
    changes.push({ field: "email", oldValue: user.email, newValue: email });
    user.email = email;
    user.isConfirmed = false;
    // TODO: resend confirmation link
  }

  if (phone && phone !== user.phone) {
    changes.push({ field: "phone", oldValue: user.phone, newValue: phone });
    user.phone = phone;
    user.isConfirmed = false;
    // TODO: resend confirmation
  }

  await user.save();

  for (const change of changes) {
    await ChangeLog.create({ ...change, userId: user._id });
  }

  res.json({ msg: "Profil mis à jour", user: { username: user.username, email: user.email, phone: user.phone } });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.getChangeHistory = async (req, res) => {
  const logs = await ChangeLog.find().populate("userId", "email username").sort({ changedAt: -1 });
  res.json(logs);
};
