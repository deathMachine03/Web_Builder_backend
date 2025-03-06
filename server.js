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

const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); // Лимит: 10MB
const DraftSettings = require("./models/draftSettings");
const LiveSettings = require("./models/liveSettings");

// ✅ Функция удаления старого файла
const deleteOldFile = (fileUrl) => {
    if (!fileUrl || !fileUrl.includes("/uploads/")) return;
    const filePath = path.join(__dirname, fileUrl.split("/uploads/")[1]);

    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error("Ошибка удаления старого файла:", err);
            else console.log("🗑 Старый файл удален:", filePath);
        });
    }
};

// ✅ Обработчик загрузки файлов
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file || !req.body.type) return res.status(400).json({ message: "Файл или тип не указан" });

    try {
        const { type } = req.body; // logo или bgImage
        const settings = await DraftSettings.findOne();
        const oldFileUrl = settings?.[type];

        deleteOldFile(oldFileUrl);

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        console.log(`✅ ${type} загружен:`, fileUrl);

        await DraftSettings.updateOne({}, { [type]: fileUrl }, { upsert: true });

        res.json({ url: fileUrl });
    } catch (error) {
        console.error("Ошибка загрузки файла:", error);
        res.status(500).json({ message: "Ошибка загрузки файла", error });
    }
});


// ✅ Подключение маршрутов (Используем один `settingsRoutes.js` вместо 3 файлов)
const settingsRoutes = require("./routes/settingsRoutes");
app.use("/api", settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
