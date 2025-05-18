require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("./middleware/authMiddleware");


const app = express();
app.use(express.json());
app.use(cors());


const domainRoutes = require("./routes/domainRoutes");
app.use("/api/domain", domainRoutes);


const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/site-builder";
mongoose
    .connect(MONGO_URI)
    .then(() => console.log(" MongoDB подключена"))
    .catch((err) => console.error(" Ошибка подключения к MongoDB:", err.message));

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

const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); 
const DraftSettings = require("./models/draftSettings");
const LiveSettings = require("./models/liveSettings");


const deleteOldFile = (fileUrl) => {
  if (!fileUrl || !fileUrl.includes("/uploads/")) return;
  const fileName = fileUrl.split("/uploads/")[1];
  const filePath = path.join(__dirname, "uploads", fileName);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Ошибка удаления файла:", err);
      else console.log("🗑 Удален файл:", filePath);
    });
  }
};



app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  if (!req.file || !req.body.type) {
    return res.status(400).json({ message: "Файл или тип не указан" });
  }

  try {
    const { type } = req.body;
    const userId = req.user.id;

    const settings = await DraftSettings.findOne({ userId });

    const oldFileUrl = settings?.[type];
    deleteOldFile(oldFileUrl);

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    console.log(`${type} загружен:`, fileUrl);

    if (settings) {
      settings[type] = fileUrl;
      await settings.save();
    } else {
      await DraftSettings.create({ userId, [type]: fileUrl });
    }

    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    res.status(500).json({ message: "Ошибка загрузки файла", error });
  }
});

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);


const settingsRoutes = require("./routes/settingsRoutes");
app.use("/api", settingsRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
