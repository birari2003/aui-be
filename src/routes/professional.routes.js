const express = require("express");
const controller = require("../controllers/professional.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile/public/:talentCode", controller.getPublicProfile);

router.use(protect, authorizeRoles("professional"));

router.post("/profile", controller.upsertProfile);
router.get("/profile", controller.getMyProfile);
router.put("/availability", controller.updateAvailability);

module.exports = router;
