const asyncHandler = require("../utils/async-handler");
const { Professional, TalentId, Availability, WorkLedger, User, Studio, StudioRequestProfessional,
  StudioJobPosting,
  Notification,
  JobApplication,
} = require("../../models");

const applyForJob = asyncHandler(async (req, res) => {
  const professional = await Professional.findOne({ where: { userId: req.user.id } });
  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const { jobPostingId, studioRequestId, verifiedResponse } = req.body;

  if (!jobPostingId && !studioRequestId) {
    return res.status(400).json({ message: "Job Posting ID or Studio Request ID is required" });
  }

  let studioId;
  if (jobPostingId) {
    const job = await StudioJobPosting.findByPk(jobPostingId);
    if (!job) return res.status(404).json({ message: "Job posting not found" });
    studioId = job.studioId;
  } else {
    const request = await StudioRequestProfessional.findByPk(studioRequestId);
    if (!request) return res.status(404).json({ message: "Studio request not found" });
    studioId = request.studioId;
  }

  const [application, created] = await JobApplication.findOrCreate({
    where: {
      professionalId: professional.id,
      studioId,
      ...(jobPostingId ? { jobPostingId } : { studioRequestId }),
    },
    defaults: {
      professionalId: professional.id,
      studioId,
      jobPostingId,
      studioRequestId,
      verifiedResponse,
      status: "applied",
    },
  });

  if (!created) {
    return res.status(400).json({ message: "You have already applied for this role" });
  }

  return res.status(201).json({ message: "Application submitted successfully", data: application });
});

const listMyApplications = asyncHandler(async (req, res) => {
  const professional = await Professional.findOne({ where: { userId: req.user.id } });
  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const applications = await JobApplication.findAll({
    where: { professionalId: professional.id },
    include: [
      {
        model: Studio,
        as: "studio",
        include: [{ model: User, as: "user", attributes: ["email", "phone"] }],
      },
      { model: StudioJobPosting, as: "jobPosting" },
      { model: StudioRequestProfessional, as: "studioRequest" },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return res.status(200).json({ data: applications });
});

const respondToAgreement = asyncHandler(async (req, res) => {
  const professional = await Professional.findOne({ where: { userId: req.user.id } });
  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const application = await JobApplication.findOne({
    where: { id: req.params.applicationId, professionalId: professional.id },
  });

  if (!application || application.status !== "agreement") {
    return res.status(400).json({ message: "Application not in agreement phase" });
  }

  const { decision } = req.body; // accepted or rejected
  if (!["accepted", "rejected"].includes(decision)) {
    return res.status(400).json({ message: "Decision must be accepted or rejected" });
  }

  await application.update({
    artistDecision: decision,
    status: decision === "accepted" ? "hired" : "rejected",
  });

  return res.status(200).json({ message: `Agreement ${decision}`, data: application });
});

const upsertProfile = asyncHandler(async (req, res) => {
  const payload = req.body;

  const [professional, created] = await Professional.findOrCreate({
    where: { userId: req.user.id },
    defaults: { ...payload, userId: req.user.id },
  });

  if (!created) {
    await professional.update(payload);
  }

  const reloaded = await Professional.findOne({ where: { id: professional.id } });

  const [talentId] = await TalentId.findOrCreate({
    where: { userId: req.user.id },
    defaults: {
      userId: req.user.id,
      talentCode: `AUI-${String(req.user.id).padStart(6, "0")}`,
    },
  });

  return res.status(200).json({
    message: created ? "Professional profile created" : "Professional profile updated",
    data: {
      profile: reloaded,
      talentId,
    },
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Professional.findOne({
    where: { userId: req.user.id },
    include: [
      { model: Availability, as: "availabilities" },
      { model: WorkLedger, as: "workLedgers" },
      { 
        model: User, 
        as: "user", 
        attributes: ["id", "email", "phone", "status"],
        include: [{ model: TalentId, as: "talentId" }]
      },
    ],
  });

  if (!profile) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  // Ensure TalentId exists
  if (!profile.user?.talentId) {
    await TalentId.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        userId: req.user.id,
        talentCode: `AUI-${String(req.user.id).padStart(6, "0")}`,
      },
    });
    // Re-fetch to include association
    return await Professional.findOne({
      where: { userId: req.user.id },
      include: [
        { model: Availability, as: "availabilities" },
        { model: WorkLedger, as: "workLedgers" },
        { 
          model: User, 
          as: "user", 
          attributes: ["id", "email", "phone", "status"],
          include: [{ model: TalentId, as: "talentId" }]
        },
      ],
    }).then(reloaded => res.status(200).json({ data: reloaded }));
  }

  return res.status(200).json({ data: profile });
});

const updateAvailability = asyncHandler(async (req, res) => {
  const { slots } = req.body;
  const professional = await Professional.findOne({ where: { userId: req.user.id } });

  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const rows = [];
  for (const slot of slots) {
    const [availability, created] = await Availability.findOrCreate({
      where: {
        professionalId: professional.id,
        date: slot.date,
      },
      defaults: {
        isAvailable: slot.isAvailable,
      },
    });

    if (!created) {
      await availability.update({ isAvailable: slot.isAvailable });
    }

    rows.push(availability);
  }

  return res.status(200).json({ message: "Availability updated", data: rows });
});

const listStudioRequests = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ data: [] });
  }

  const professional = await Professional.findOne({ where: { userId: req.user.id } });
  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const requests = await StudioRequestProfessional.findAll({
    where: { professionalId: professional.id },
    include: [
      {
        model: Studio,
        as: "studio",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "status"],
            include: [{ model: TalentId, as: "talentId" }],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: requests });
});

const respondToStudioRequest = asyncHandler(async (req, res) => {
  const professional = await Professional.findOne({ where: { userId: req.user.id } });
  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const request = await StudioRequestProfessional.findOne({
    where: { id: req.params.requestId, professionalId: professional.id },
  });

  if (!request) {
    return res.status(404).json({ message: "Studio request not found" });
  }

  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be accepted or rejected" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Only pending requests can be updated" });
  }

  await request.update({ status });

  return res.status(200).json({ message: `Studio request ${status}`, data: request });
});

const listStudioJobPostings = asyncHandler(async (req, res) => {
  const professional = await Professional.findOne({ where: { userId: req.user.id } });
  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const rows = await StudioJobPosting.findAll({
    include: [
      {
        model: Studio,
        as: "studio",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "status"],
            include: [{ model: TalentId, as: "talentId" }],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const data = await Promise.all(
    rows.map(async (row) => {
      const count = await JobApplication.count({
        where: {
          jobPostingId: row.id,
          status: "hired",
        },
      });
      if (row.filledCount !== count) {
        await row.update({ filledCount: count });
      }
      return {
        ...row.toJSON(),
        filledCount: count,
      };
    })
  );

  return res.status(200).json({ data });
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const { talentCode } = req.params;

  const talentId = await TalentId.findOne({
    where: { talentCode },
    include: [
      {
        model: User,
        as: "user",
        include: [
          {
            model: Professional,
            as: "professional",
            include: [
              { model: Availability, as: "availabilities" },
              { model: WorkLedger, as: "workLedgers" },
              { model: User, as: "user", attributes: ["status"] },
            ],
          },
        ],
      },
    ],
  });

  if (!talentId || !talentId.user?.professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  return res.status(200).json({ data: talentId.user.professional });
});

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Studio,
        as: "studio",
        include: [{ model: User, as: "user", include: [{ model: TalentId, as: "talentId" }] }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: notifications });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  await notification.update({ isRead: true });

  return res.status(200).json({ message: "Notification marked as read" });
});

module.exports = {
  upsertProfile,
  getMyProfile,
  updateAvailability,
  getPublicProfile,
  listStudioRequests,
  respondToStudioRequest,
  listStudioJobPostings,
  getMyNotifications,
  markNotificationAsRead,
  applyForJob,
  listMyApplications,
  respondToAgreement,
};
