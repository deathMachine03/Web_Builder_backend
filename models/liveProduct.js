const mongoose = require("mongoose");

const LiveProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
});

module.exports = mongoose.model("LiveProduct", LiveProductSchema);
