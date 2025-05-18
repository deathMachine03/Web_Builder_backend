const express = require("express");
const router = express.Router();
const { 
    getDraftSettings, 
    updateDraftSettings, 
    publishSettings, 
    getLiveSettingsByUserId,
    getLiveSettings,
} = require("../controllers/settingsController");
const authMiddleware = require("../middleware/authMiddleware");



router.get("/draft", authMiddleware, getDraftSettings);
router.patch("/draft", authMiddleware, updateDraftSettings);
router.post("/publish", authMiddleware, publishSettings);
router.get("/settings/live/:userId", getLiveSettingsByUserId);
// router.get("/live", getLiveSettings);


module.exports = router;
