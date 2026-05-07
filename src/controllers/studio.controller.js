const asyncHandler = require("../utils/async-handler");
const {
  Studio,
  Engagement,
  TalentBench,
  HiringRequest,
  Professional,
  StudioRequestProfessional,
  StudioJobPosting,
  User,
  TalentId,
  Notification,
} = require("../../models");
const { createLedgerFromEngagement } = require("../services/ledger.service");

async function getStudioByUser(userId) {
  return Studio.findOne({ where: { userId } });
}

const upsertProfile = asyncHandler(async (req, res) => {
  const payload = req.body;

  const [studio, created] = await Studio.findOrCreate({
    where: { userId: req.user.id },
    defaults: { ...payload, userId: req.user.id },
  });

  if (!created) {
    await studio.update(payload);
  }

  const [talentId] = await TalentId.findOrCreate({
    where: { userId: req.user.id },
    defaults: {
      userId: req.user.id,
      talentCode: `AUI-STU-${String(req.user.id).padStart(6, "0")}`,
    },
  });

  return res.status(200).json({
    message: created ? "Studio profile created" : "Studio profile updated",
    data: {
      studio,
      talentId
    },
  });
});

const createEngagement = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const engagement = await Engagement.create({ ...req.body, studioId: studio.id });
  return res.status(201).json({ message: "Engagement request sent", data: engagement });
});

const updateEngagementStatus = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const engagement = await Engagement.findOne({
    where: { id: req.params.engagementId, studioId: studio.id },
  });

  if (!engagement) {
    return res.status(404).json({ message: "Engagement not found" });
  }

  await engagement.update({ status: req.body.status });

  if (req.body.status === "completed") {
    await createLedgerFromEngagement(engagement);
  }

  return res.status(200).json({ message: "Engagement status updated", data: engagement });
});

const listEngagements = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const rows = await Engagement.findAll({
    where: { studioId: studio.id },
    include: [{ model: Professional, as: "professional" }],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: rows });
});

const saveTalent = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const professional = await Professional.findByPk(req.body.professionalId);
  if (!professional) {
    return res.status(404).json({ message: "Professional not found" });
  }

  const [row, created] = await TalentBench.findOrCreate({
    where: {
      studioId: studio.id,
      professionalId: req.body.professionalId,
    },
    defaults: {
      studioId: studio.id,
      professionalId: req.body.professionalId,
    },
  });

  if (created) {
    await Notification.create({
      userId: professional.userId,
      studioId: studio.id,
      type: "BENCHED",
      message: `${studio.studioName} has benched you.`,
    });
  }

  return res.status(created ? 201 : 200).json({
    message: created ? "Talent saved to bench" : "Talent already in bench",
    data: row,
  });
});

const removeTalent = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await TalentBench.findOne({
    where: {
      studioId: studio.id,
      professionalId: Number(req.params.professionalId),
    },
  });

  if (!row) {
    return res.status(404).json({ message: "Talent not found in bench" });
  }

  const professional = await Professional.findByPk(req.params.professionalId);
  if (professional) {
    await Notification.destroy({
      where: {
        userId: professional.userId,
        studioId: studio.id,
        type: "BENCHED",
      },
    });
  }

  await row.destroy();
  return res.status(200).json({ message: "Talent removed from bench" });
});

const createStudioRequestProfessional = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const {
    professionalId,
    projectTimeline,
    productionType,
    engagementBrief,
    proposedBudget,
    startDate,
  } = req.body;

  const professional = await Professional.findByPk(professionalId);
  if (!professional) {
    return res.status(404).json({ message: "Professional not found" });
  }

  const inBench = await TalentBench.findOne({
    where: {
    studioId: studio.id,
      professionalId,
    },
  });

  if (!inBench) {
    return res.status(400).json({ message: "Please add talent to bench before requesting engagement" });
  }

  const row = await StudioRequestProfessional.create({
    studioId: studio.id,
    professionalId,
    projectTimeline,
    productionType,
    engagementBrief,
    proposedBudget,
    startDate,
  });

  return res.status(201).json({ message: "Engagement request sent", data: row });
});

const listStudioRequestProfessional = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const rows = await StudioRequestProfessional.findAll({
    where: { studioId: studio.id },
    include: [
      {
        model: Professional,
        as: "professional",
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

  return res.status(200).json({ data: rows });
});

const createStudioJobPosting = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await StudioJobPosting.create({
    studioId: studio.id,
    title: req.body.title,
    projectType: req.body.projectType,
    experienceRequired: req.body.experienceRequired,
    artistCount: req.body.artistCount,
    startDate: req.body.startDate,
    description: req.body.description,
    status: req.body.status || "open",
  });

  return res.status(201).json({ message: "Job posted successfully", data: row });
});

const listStudioJobPostings = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const rows = await StudioJobPosting.findAll({
    where: { studioId: studio.id },
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: rows });
});

const listTalentBench = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const rows = await TalentBench.findAll({
    where: { studioId: studio.id },
    include: [
      {
        model: Professional,
        as: "professional",
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

  return res.status(200).json({ data: rows });
});

const createHiringRequest = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await HiringRequest.create({ ...req.body, studioId: studio.id });
  return res.status(201).json({ message: "Hiring request posted", data: row });
});

module.exports = {
  upsertProfile,
  createEngagement,
  updateEngagementStatus,
  listEngagements,
  saveTalent,
  removeTalent,
  listTalentBench,
  createStudioRequestProfessional,
  listStudioRequestProfessional,
  createStudioJobPosting,
  listStudioJobPostings,
  createHiringRequest,
};
