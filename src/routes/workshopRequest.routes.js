const express = require("express");
const router = express.Router();
const controller = require("../controllers/workshopRequest.controller");
const { protect } = require("../middlewares/auth.middleware");

// Institute routes
router.post("/", protect, controller.createRequest);
router.get("/my-requests", protect, controller.getInstituteRequests);

// Admin routes (should ideally be restricted to admin role)
router.get("/all", protect, controller.getAllRequests);
router.patch("/:id/status", protect, controller.updateStatus);

module.exports = router;
