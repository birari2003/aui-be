const express = require("express");
const controller = require("../controllers/admin.controller");
const { protect, authorizeAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect, authorizeAdmin);

router.get("/users", controller.listUsers);
router.patch("/users/:userId/status", controller.updateUserStatus);
router.patch("/professionals/:professionalId/verify", controller.verifyProfessional);
router.patch("/studios/:studioId/verify", controller.verifyStudio);
router.patch("/institutes/:instituteId/verify", controller.verifyInstitute);
router.get("/engagements", controller.listEngagements);
router.get("/bookings", controller.listBookings);
router.get("/analytics", controller.analytics);
router.get("/email-accounts", controller.getEmailAccounts);
router.post("/send-bulk-email", controller.sendBulkEmail);

module.exports = router;
