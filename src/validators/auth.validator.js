const { body } = require("express-validator");

const registerValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").optional().isString(),
  body("role")
    .isIn(["professional", "studio", "institute", "admin"])
    .withMessage("Role must be professional, studio, institute, or admin"),
  body("fullName").optional().isString(),
  body("profileData").optional().isObject().withMessage("Profile data is required"),
];

const requestOtpValidator = [body("email").isEmail().withMessage("Valid email is required")];
const checkStatusValidator = [body("email").isEmail().withMessage("Valid email is required")];

const verifyOtpValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp").isLength({ min: 4, max: 4 }).withMessage("OTP must be 4 digits"),
];

module.exports = {
  registerValidator,
  requestOtpValidator,
  verifyOtpValidator,
  checkStatusValidator,
};
