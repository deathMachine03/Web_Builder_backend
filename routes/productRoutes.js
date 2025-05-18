const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const {
    getDraftProducts,
    addDraftProduct,
    updateDraftProduct,
    deleteDraftProduct,
    publishProducts,
    getLiveProducts,
    getDraftProductById,
    getLiveProductsByUserId,
    getLiveProductById,
} = require("../controllers/productController");

router.get("/draft", auth, getDraftProducts);
router.post("/draft", auth, addDraftProduct);
router.patch("/draft/:id", auth, updateDraftProduct);
router.delete("/draft/:id", auth, deleteDraftProduct);
router.post("/publish", auth, publishProducts);
router.get("/draft/:id", auth, getDraftProductById);
router.get("/live/:userId", getLiveProductsByUserId);
router.get("/live/:userId/:id", getLiveProductById);

// router.get("/live", auth, getLiveProducts);

module.exports = router;
