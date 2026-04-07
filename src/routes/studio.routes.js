const express = require("express");
const controller = require("../controllers/studio.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect, authorizeRoles("studio"));

router.post("/profile", controller.upsertProfile);
router.post("/engagements", controller.createEngagement);
router.patch("/engagements/:engagementId/status", controller.updateEngagementStatus);
router.get("/engagements", controller.listEngagements);
router.post("/talent-bench", controller.saveTalent);
router.get("/talent-bench", controller.listTalentBench);
router.post("/hiring-requests", controller.createHiringRequest);

module.exports = router;
