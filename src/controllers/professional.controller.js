const asyncHandler = require("../utils/async-handler");
const { Professional, TalentId, Availability, WorkLedger, User } = require("../../models");

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
    where: { professionalId: professional.id },
    defaults: {
      professionalId: professional.id,
      talentCode: `AUI-${String(professional.id).padStart(6, "0")}`,
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
      { model: TalentId, as: "talentId" },
      { model: Availability, as: "availabilities" },
      { model: WorkLedger, as: "workLedgers" },
      { model: User, as: "user", attributes: ["id", "email", "phone", "status"] },
    ],
  });

  if (!profile) {
    return res.status(404).json({ message: "Professional profile not found" });
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

module.exports = {
  upsertProfile,
  getMyProfile,
  updateAvailability,
};
