const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordResetSchema = new Schema({
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const PasswordReset = mongoose.model("PasswordReset", PasswordReset);

module.exports = PasswordReset;
