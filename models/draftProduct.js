const mongoose = require("mongoose");

const DraftProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
});

module.exports = mongoose.model("DraftProduct", DraftProductSchema);
