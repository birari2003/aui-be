const express = require("express");
const router = express.Router();
const controller = require("../controllers/studioProfile.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../services/upload.service");

router.get("/me", auth.protect, controller.getMyStudioPublicProfile);
router.get("/list", controller.getAllStudioProfiles);
router.get("/talent/:talentCode", controller.getStudioProfileByTalentCode);

router.post(
  "/upsert",
  auth.protect,
  upload.fields([
    { name: "logoFile", maxCount: 1 },
    { name: "bannerImageFile", maxCount: 1 },
    { name: "projectThumbnails", maxCount: 20 },
    { name: "clientLogos", maxCount: 20 },
  ]),
  controller.upsertStudioProfile
);

module.exports = router;
