const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
    logo: String,
    bgImage: String,
    text: String,
    headerColor: String,
    buttonColor: String,
    buttonText: String
  });
  

const Settings = mongoose.model("Settings", SettingsSchema);
module.exports = Settings;
