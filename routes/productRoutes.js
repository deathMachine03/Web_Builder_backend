const express = require("express");
const router = express.Router();
const {
    getDraftProducts,
    addDraftProduct,
    updateDraftProduct,
    deleteDraftProduct,
    publishProducts,
    getLiveProducts,
    getDraftProductById
} = require("../controllers/productController");

// 🔄 Черновик (DRAFT)
router.get("/draft", getDraftProducts);
router.post("/draft", addDraftProduct);
router.patch("/draft/:id", updateDraftProduct);
router.delete("/draft/:id", deleteDraftProduct);
router.get("/draft/:id", getDraftProductById);

// 🚀 Публикация товаров
router.post("/publish", publishProducts);

// 🌍 Опубликованные товары (LIVE)
router.get("/live", getLiveProducts);

module.exports = router;
