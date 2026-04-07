const asyncHandler = require("../utils/async-handler");
const { Studio, Engagement, TalentBench, HiringRequest, Professional, User } = require("../../models");
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

  return res.status(200).json({
    message: created ? "Studio profile created" : "Studio profile updated",
    data: studio,
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

  const row = await TalentBench.create({
    studioId: studio.id,
    professionalId: req.body.professionalId,
  });

  return res.status(201).json({ message: "Talent saved to bench", data: row });
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
        include: [{ model: User, as: "user", attributes: ["email", "status"] }],
      },
    ],
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
  listTalentBench,
  createHiringRequest,
};
