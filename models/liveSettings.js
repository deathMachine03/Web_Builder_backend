const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
    logo: { type: String, default: "" },
    bgImage: { type: String, default: "" },
    text: { type: String, default: "Добро пожаловать!" },
    headerColor: { type: String, default: "#ffffff" },
    buttonColor: { type: String, default: "#007bff" },
    buttonText: { type: String, default: "Перейти к товарам" },
    footerText: { type: String, default: "© 2025 Все права защищены" },
    footerColor: { type: String, default: "#1a1a1a" },
    phone: { type: String, default: "+7 (999) 123-45-67" },
    email: { type: String, default: "info@example.com" },
    address: { type: String, default: "г. Алматы, ул. Абая 10" },
    socialLinks: {
        type: [
            {
                id: { type: Number, required: true, unique: true },
                name: { type: String, required: true },
                url: { type: String, required: true }
            }
        ],
        default: [
            { id: 1, name: "Instagram", url: "https://instagram.com" },
            { id: 2, name: "Facebook", url: "https://facebook.com" },
            { id: 3, name: "Twitter", url: "https://twitter.com" }
        ]
    }
});

module.exports = mongoose.model("LiveSettings", SettingsSchema);
