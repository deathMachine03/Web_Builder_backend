const express = require("express");
const router = express.Router();
const { 
    getDraftSettings, 
    updateDraftSettings, 
    publishSettings, 
    getLiveSettings 
} = require("../controllers/settingsController");

// 🔄 Работа с черновиком (для конструктора)
router.get("/draft", getDraftSettings);   // Получить черновик
router.patch("/draft", updateDraftSettings); // Обновить черновик

// 🚀 Публикация (копирование из `draft` в `live`)
router.post("/publish", publishSettings);

// 🌍 Работа с опубликованными настройками (для storefront)
router.get("/live", getLiveSettings); // Получить опубликованный сайт

module.exports = router;
