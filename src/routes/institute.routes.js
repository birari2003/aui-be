const express = require("express");
const controller = require("../controllers/institute.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect, authorizeRoles("institute"));

router.post("/profile", controller.upsertProfile);
router.post("/bookings", controller.createBooking);
router.patch("/bookings/:bookingId/status", controller.updateBookingStatus);
router.get("/bookings", controller.listBookings);

module.exports = router;
