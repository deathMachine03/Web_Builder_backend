const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { assignDomain, getDomain,getUserIdByDomain  } = require("../controllers/domainController");

router.post("/assign", auth, assignDomain);
router.get("/me", auth, getDomain);
router.get("/:domain", getUserIdByDomain);


module.exports = router;
