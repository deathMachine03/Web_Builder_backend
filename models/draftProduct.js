const mongoose = require("mongoose");

const DraftProductSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("DraftProduct", DraftProductSchema);
