const express = require("express");
const controller = require("../controllers/institute.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile/public/:talentCode", controller.getPublicProfile);

router.use(protect, authorizeRoles("institute"));

router.get("/profile", controller.getMyProfile);
router.post("/profile", controller.upsertProfile);
router.post("/bookings", controller.createBooking);
router.patch("/bookings/:bookingId/status", controller.updateBookingStatus);
router.get("/bookings", controller.listBookings);

module.exports = router;
