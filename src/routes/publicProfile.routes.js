const express = require("express");
const router = express.Router();
const controller = require("../controllers/publicProfile.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../services/upload.service");

// Public route to fetch profile by talentCode
router.get("/code/:talentCode", controller.getPublicProfile);

// Protected routes
router.get("/me", auth.protect, controller.getMyPublicProfile);

router.post(
  "/upsert",
  auth.protect,
  upload.fields([
    { name: "showreelVideo", maxCount: 1 },
    { name: "projectImages", maxCount: 20 },
    { name: "profileImageFile", maxCount: 1 },
    { name: "workLedgerImageFile", maxCount: 1 },
  ]),
  controller.upsertPublicProfile
);

module.exports = router;
