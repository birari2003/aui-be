const express = require("express");
const router = express.Router();
const controller = require("../controllers/instituteProfile.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../services/upload.service");

router.get("/me", auth.protect, controller.getMyInstitutePublicProfile);
router.get("/list", controller.getAllInstituteProfiles);
router.get("/talent/:talentCode", controller.getInstituteProfileByTalentCode);

router.post(
  "/upsert",
  auth.protect,
  upload.fields([
    { name: "logoFile", maxCount: 1 },
    { name: "bannerImageFile", maxCount: 1 },
    { name: "programThumbnails", maxCount: 20 },
    { name: "partnerLogos", maxCount: 20 },
    { name: "testimonialPhotos", maxCount: 20 },
  ]),
  controller.upsertInstituteProfile
);

module.exports = router;
