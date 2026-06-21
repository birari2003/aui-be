const asyncHandler = require("../utils/async-handler");
const { Op } = require("sequelize");
const { User, Professional, Studio, Institute, Engagement, Booking, TalentId } = require("../../models");
const { sendStatusUpdateEmail, sendCustomEmail } = require("../services/mail.service");

const listUsers = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.role) where.role = req.query.role;

  const users = await User.findAll({
    where,
    include: [{ model: TalentId, as: 'talentId' }],
    order: [["createdAt", "DESC"]]
  });

  const professionalUserIds = users.filter((u) => u.role === "professional").map((u) => u.id);
  const studioUserIds = users.filter((u) => u.role === "studio").map((u) => u.id);
  const instituteUserIds = users.filter((u) => u.role === "institute").map((u) => u.id);

  const [professionals, studios, institutes] = await Promise.all([
    professionalUserIds.length
      ? Professional.findAll({ where: { userId: { [Op.in]: professionalUserIds } } })
      : [],
    studioUserIds.length
      ? Studio.findAll({ where: { userId: { [Op.in]: studioUserIds } } })
      : [],
    instituteUserIds.length
      ? Institute.findAll({ where: { userId: { [Op.in]: instituteUserIds } } })
      : [],
  ]);

  const professionalByUserId = new Map(professionals.map((row) => [row.userId, row.toJSON()]));
  const studioByUserId = new Map(studios.map((row) => [row.userId, row.toJSON()]));
  const instituteByUserId = new Map(institutes.map((row) => [row.userId, row.toJSON()]));

  const enrichedUsers = users.map((user) => {
    const plain = user.toJSON();

    plain.professional = professionalByUserId.get(user.id) || null;
    plain.studio = studioByUserId.get(user.id) || null;
    plain.institute = instituteByUserId.get(user.id) || null;

    return plain;
  });

  return res.status(200).json({ data: enrichedUsers });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.userId, {
    include: [
      { model: Professional, as: "professional" },
      { model: Studio, as: "studio" },
      { model: Institute, as: "institute" },
      { model: TalentId, as: "talentId" },
    ],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const oldStatus = user.status;
  const newStatus = req.body.status;

  await user.update({ status: newStatus });

  if (oldStatus !== newStatus && (newStatus === "approved" || newStatus === "rejected")) {
    let name = "";
    if (user.role === "professional" && user.professional) {
      name = user.professional.fullName;
    } else if (user.role === "studio" && user.studio) {
      name = user.studio.studioName;
    } else if (user.role === "institute" && user.institute) {
      name = user.institute.instituteName;
    } else {
      name = user.email;
    }

    const talentCode = user.talentId ? user.talentId.talentCode : null;

    sendStatusUpdateEmail(user.email, name, user.role, newStatus, talentCode).catch((err) => {
      console.error(`Failed to send status update email to ${user.email}:`, err);
    });
  }

  return res.status(200).json({ message: "User status updated", data: user });
});

const verifyProfessional = asyncHandler(async (req, res) => {
  const professional = await Professional.findByPk(req.params.professionalId);
  if (!professional) {
    return res.status(404).json({ message: "Professional not found" });
  }

  await professional.update({ verificationStatus: req.body.verificationStatus });
  return res.status(200).json({ message: "Professional verification updated", data: professional });
});

const verifyStudio = asyncHandler(async (req, res) => {
  const studio = await Studio.findByPk(req.params.studioId);
  if (!studio) {
    return res.status(404).json({ message: "Studio not found" });
  }

  await studio.update({ verificationStatus: req.body.verificationStatus });
  return res.status(200).json({ message: "Studio verification updated", data: studio });
});

const verifyInstitute = asyncHandler(async (req, res) => {
  const institute = await Institute.findByPk(req.params.instituteId);
  if (!institute) {
    return res.status(404).json({ message: "Institute not found" });
  }

  await institute.update({ verificationStatus: req.body.verificationStatus });
  return res.status(200).json({ message: "Institute verification updated", data: institute });
});

const listEngagements = asyncHandler(async (_req, res) => {
  const rows = await Engagement.findAll({ order: [["createdAt", "DESC"]] });
  return res.status(200).json({ data: rows });
});

const listBookings = asyncHandler(async (_req, res) => {
  const rows = await Booking.findAll({ order: [["createdAt", "DESC"]] });
  return res.status(200).json({ data: rows });
});

const analytics = asyncHandler(async (_req, res) => {
  const [users, professionals, studios, institutes, engagements, bookings] = await Promise.all([
    User.count(),
    Professional.count(),
    Studio.count(),
    Institute.count(),
    Engagement.count(),
    Booking.count(),
  ]);

  return res.status(200).json({
    data: {
      users,
      professionals,
      studios,
      institutes,
      engagements,
      bookings,
    },
  });
});

const sendBulkEmail = asyncHandler(async (req, res) => {
  const { emails, subject, body } = req.body;
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ message: "No recipient emails provided" });
  }
  if (!subject) {
    return res.status(400).json({ message: "Email subject is required" });
  }
  if (!body) {
    return res.status(400).json({ message: "Email body is required" });
  }

  const results = [];
  const errors = [];

  for (const email of emails) {
    try {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #1f2937;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">AUI Network Update</h2>
          <div style="line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${body}</div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} AUI Network. All rights reserved.</p>
        </div>
      `;
      await sendCustomEmail(email, subject, htmlBody);
      results.push(email);
    } catch (err) {
      console.error(`Failed to send email to ${email}:`, err);
      errors.push({ email, error: err.message });
    }
  }

  return res.status(200).json({
    message: `Emails sent to ${results.length} users. ${errors.length} failed.`,
    sentCount: results.length,
    failedCount: errors.length,
    failures: errors
  });
});

module.exports = {
  listUsers,
  updateUserStatus,
  verifyProfessional,
  verifyStudio,
  verifyInstitute,
  listEngagements,
  listBookings,
  analytics,
  sendBulkEmail,
};
