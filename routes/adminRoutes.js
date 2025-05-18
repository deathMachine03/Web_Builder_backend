const express = require("express");
const router = express.Router();
const { getAllUsers, getUserStats } = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");


router.get("/users", auth, getAllUsers);
router.get("/users/stats", auth, getUserStats);

module.exports = router;
