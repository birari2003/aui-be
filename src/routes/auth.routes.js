const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  registerValidator,
  requestOtpValidator,
  verifyOtpValidator,
  checkStatusValidator,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/check-status", checkStatusValidator, validate, authController.checkStatus);
router.post("/request-otp", requestOtpValidator, validate, authController.requestOtp);
router.post("/verify-otp", verifyOtpValidator, validate, authController.verifyOtp);
router.get("/me", protect, authController.me);

module.exports = router;
