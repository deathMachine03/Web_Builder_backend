require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Гарантируем, что файлы сохраняются в `backend/uploads/`
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Раздача загруженных файлов (правильный путь!)
app.use("/uploads", express.static(uploadDir));

// Подключение к MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/site-builder";
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB подключена"))
    .catch((err) => console.error("❌ Ошибка подключения к MongoDB:", err.message));

// ✅ Настройка Multer с правильным путем
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Неверный формат файла"), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // Лимит: 2MB

// ✅ Обработчик загрузки файлов
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Файл не загружен" });

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    console.log("✅ Файл загружен:", fileUrl);

    res.json({ url: fileUrl });
});

// ✅ Подключение маршрутов для конструктора и конечного сайта
const draftRoutes = require("./routes/draftRoutes"); // Черновик (admin-panel)
const liveRoutes = require("./routes/liveRoutes"); // Публичный сайт (storefront)
const publishRoutes = require("./routes/publishRoutes"); // Публикация

app.use("/api/draft", draftRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/publish", publishRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
