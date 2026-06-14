const express = require("express");
const controller = require("../controllers/studio.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const upload = require("../services/upload.service");

const router = express.Router();

router.use(protect, authorizeRoles("studio"));

router.get("/profile", controller.getProfile);
router.post("/profile", controller.upsertProfile);
router.post("/engagements", controller.createEngagement);
router.patch("/engagements/:engagementId/status", controller.updateEngagementStatus);
router.get("/engagements", controller.listEngagements);
router.post("/talent-bench", controller.saveTalent);
router.delete("/talent-bench/:professionalId", controller.removeTalent);
router.get("/talent-bench", controller.listTalentBench);
router.post("/request-professionals", controller.createStudioRequestProfessional);
router.get("/request-professionals", controller.listStudioRequestProfessional);
router.patch("/request-professionals/:id", controller.updateStudioRequestProfessional);

// Job Postings
router.get("/job-postings", controller.listStudioJobPostings);
router.post("/job-postings", controller.createStudioJobPosting);
router.patch("/job-postings/:id", controller.updateStudioJobPosting);
router.delete("/job-postings/:id", controller.deleteStudioJobPosting);
router.post("/job-postings/:id/upload-attachments", upload.array("attachments", 10), controller.uploadJobPostingAttachments);

// Applications & Hiring Flow
router.get("/applications", controller.listJobApplications);
router.patch("/applications/:applicationId/status", controller.updateApplicationStatus);
router.post("/applications/:applicationId/finalize-agreement", controller.finalizeAgreement);

router.post("/hiring-requests", controller.createHiringRequest);

module.exports = router;
