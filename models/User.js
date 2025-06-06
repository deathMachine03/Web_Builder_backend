const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  customDomain: {type: String, unique: true, sparse: true, },

});

module.exports = mongoose.model("User", UserSchema);
