const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  field: String,
  oldValue: String,
  newValue: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  resetPasswordCode: String,
  role: {
    type: String,
    default: "user",
  },
  
  tempEmail: String,
  emailVerificationCode: String,
  tempPhone: String,
  phoneVerificationCode: String,

  history: [historySchema],
});

module.exports = mongoose.model("User", userSchema);
