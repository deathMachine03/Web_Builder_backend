const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const draftSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  logo: String,
  bgImage: String,
  text: String,
  headerColor: String,
  buttonColor: String,
  buttonText: String,
  footerText: String,
  footerColor: String,
  phone: String,
  email: String,
  address: String,

  socialLinks: {
    type: [socialLinkSchema],
    default: []
  }
});

module.exports = mongoose.model("DraftSettings", draftSettingsSchema);
