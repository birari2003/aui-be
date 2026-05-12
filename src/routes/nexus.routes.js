const express = require("express");
const router = express.Router();
const controller = require("../controllers/nexus.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public/Institute access
router.get("/", controller.listOpportunities);

// Admin only access
router.post("/", protect, controller.createOpportunity);
router.put("/:id", protect, controller.updateOpportunity);
router.delete("/:id", protect, controller.deleteOpportunity);

module.exports = router;
