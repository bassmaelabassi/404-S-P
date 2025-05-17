const mongoose = require("mongoose");

const changeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  field: String,
  oldValue: String,
  newValue: String,
  changedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChangeLog", changeLogSchema);
