const express = require("express");
const {
  getAspirantProfile,
  updateAspirantProfile,
  getAllAspirants,
  getAspirantById,
  updateAspirant,
  deleteAspirant,
  shareAspirants,
  getAspirantShares,
  getSharedAspirantsForInstitute,
} = require("../controllers/aspirant.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public / Aspirant routes
router.get("/profile", protect, getAspirantProfile);
router.put("/profile", protect, updateAspirantProfile);

// Share routes
router.post("/share", protect, shareAspirants);
router.get("/shares", protect, getAspirantShares);
router.get("/shared-for-institute", protect, getSharedAspirantsForInstitute);

// Admin / List routes
router.get("/", getAllAspirants);
router.get("/:id", getAspirantById);
router.put("/:id", updateAspirant);
router.delete("/:id", deleteAspirant);

module.exports = router;
