const mongoose = require("mongoose");

const historyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changes: [
    {
      field: String,
      oldValue: String,
      newValue: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("HistoryLog", historyLogSchema);
