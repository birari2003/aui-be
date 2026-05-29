const express = require("express");
const controller = require("../controllers/professional.controller");
const { protect, optionalAuth, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile/public/:talentCode", controller.getPublicProfile);
router.get("/studio-requests", optionalAuth, controller.listStudioRequests);

router.use(protect, authorizeRoles("professional"));

router.post("/profile", controller.upsertProfile);
router.get("/profile", controller.getMyProfile);
router.put("/availability", controller.updateAvailability);
router.patch("/studio-requests/:requestId/status", controller.respondToStudioRequest);
router.get("/studio-job-postings", controller.listStudioJobPostings);
router.get("/notifications", controller.getMyNotifications);
router.patch("/notifications/:id/read", controller.markNotificationAsRead);

// Applications & Hiring Flow
router.post("/applications", controller.applyForJob);
router.get("/applications", controller.listMyApplications);
router.patch("/applications/:applicationId/respond-agreement", controller.respondToAgreement);

module.exports = router;
