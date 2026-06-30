const express = require("express");
const router = express.Router();
const controller = require("../controllers/showreel.controller");
const { protect, authorizeAdmin } = require("../middlewares/auth.middleware");
const upload = require("../services/upload.service");

// Public list showreels
router.get("/", controller.listShowreels);

// Public single showreel by ID
router.get("/:id", controller.getShowreel);

// Admin only actions
router.post(
  "/",
  protect,
  authorizeAdmin,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 }
  ]),
  controller.createShowreel
);

router.delete(
  "/:id",
  protect,
  authorizeAdmin,
  controller.deleteShowreel
);

router.put(
  "/:id",
  protect,
  authorizeAdmin,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 }
  ]),
  controller.updateShowreel
);

module.exports = router;
