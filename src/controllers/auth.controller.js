const { Op } = require("sequelize");
const asyncHandler = require("../utils/async-handler");
const { User, OtpVerification, Professional, Studio, Institute, Aspirant, TalentId, sequelize } = require("../../models");
const { generateToken } = require("../utils/token.util");
const { sendOtpEmail, sendPendingEmail } = require("../services/mail.service");

const register = asyncHandler(async (req, res) => {
  const { email, phone, role, fullName, profileData } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const result = await sequelize.transaction(async (t) => {
    const user = await User.create({ email, phone, role, status: "pending" }, { transaction: t });

    let profile;
    if (role === 'professional') {
      profile = await Professional.create({
        userId: user.id,
        fullName: fullName || profileData.fullName,
        email,
        ...profileData
      }, { transaction: t });
      // Create talent id for professional
      const exp = String(profileData.experienceYears || 0).padStart(2, "0");
      const rand = Math.floor(1000 + Math.random() * 9000);
      const talentCode = `AUI-${exp}X-${rand}`;
      await TalentId.create({ userId: user.id, talentCode }, { transaction: t });
    } else if (role === 'studio') {
      profile = await Studio.create({
        userId: user.id,
        email,
        ...profileData
      }, { transaction: t });
      // Create talent id for studio
      const talentCode = `AUI-STU-${String(user.id).padStart(6, "0")}`;
      await TalentId.create({ userId: user.id, talentCode }, { transaction: t });
    } else if (role === 'institute') {
      profile = await Institute.create({
        userId: user.id,
        email,
        ...profileData
      }, { transaction: t });
      // Create talent id for institute
      const talentCode = `AUI-INST-${String(user.id).padStart(6, "0")}`;
      await TalentId.create({ userId: user.id, talentCode }, { transaction: t });
    } else if (role === 'aspirant') {
      profile = await Aspirant.create({
        userId: user.id,
        fullName: fullName || profileData.fullName,
        email,
        phone: phone || profileData.phone,
        ...profileData
      }, { transaction: t });
      // Create talent id for aspirant
      const talentCode = `AUI-ASP-${String(user.id).padStart(6, "0")}`;
      await TalentId.create({ userId: user.id, talentCode }, { transaction: t });
    }

    return { user, profile };
  });

  // Determine name based on role
  let name = "";
  if (role === 'professional' || role === 'aspirant') {
    name = result.profile.fullName;
  } else if (role === 'studio') {
    name = result.profile.studioName;
  } else if (role === 'institute') {
    name = result.profile.instituteName;
  }

  // Send pending email asynchronously without awaiting to ensure rapid API response
  sendPendingEmail(email, name, role).catch((err) => {
    console.error(`Failed to send registration pending email to ${email}:`, err);
  });

  return res.status(201).json({
    message: "Registration submitted. Wait for admin approval.",
    data: result,
  });
});

const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Only approved users or admins can login
  if (user.status !== "approved" && user.role !== "admin") {
    return res.status(403).json({ message: "Account is pending admin approval" });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  // Save OTP to DB
  await OtpVerification.create({
    userId: user.id,
    otpCode: otp,
    expiresAt,
  });

  // Send Email
  try {
    await sendOtpEmail(email, otp);
    return res.status(200).json({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return res.status(500).json({ message: "Failed to send verification email" });
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otpRow = await OtpVerification.findOne({
    where: {
      userId: user.id,
      otpCode: otp,
      consumedAt: null,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
    order: [["created_at", "DESC"]], // Note: migration uses created_at
  });

  if (!otpRow) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  otpRow.consumedAt = new Date();
  await otpRow.save();

  const token = generateToken(user);

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
});

const checkStatus = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(200).json({
      registered: false,
      message: "User not found",
    });
  }

  let message = "";
  if (user.status === "pending") {
    message = "Your application is currently pending review. We will notify you once it's approved.";
  } else if (user.status === "approved") {
    message = "Your account is already approved. Please proceed to login.";
  } else if (user.status === "rejected") {
    message = "Your application was not approved. Please contact admin for more information.";
  }

  return res.status(200).json({
    registered: true,
    status: user.status,
    message,
  });
});

const me = asyncHandler(async (req, res) => {
  return res.status(200).json({ data: req.user });
});

module.exports = {
  register,
  requestOtp,
  verifyOtp,
  checkStatus,
  me,
};
