const User = require("../models/User");

exports.getUserStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  res.json({ totalUsers });
};
exports.getAllUsers = async (req, res) => {
  const users = await User.find({}, "username email phone role createdAt").sort({ createdAt: -1 });
  res.json(users);
};

exports.getUserHistory = async (req, res) => {
  const users = await User.find({}, "username history");

  const history = users.flatMap((user) =>
    user.history.map((entry) => ({
      userId: user._id,
      username: user.username,
      field: entry.field,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      date: entry.date,
    }))
  );

  history.sort((a, b) => b.date - a.date);

  res.json(history);
};
