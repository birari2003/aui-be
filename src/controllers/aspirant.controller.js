const asyncHandler = require("../utils/async-handler");
const { Aspirant, User, Education, TalentId, AspirantShare, Institute } = require("../../models");

const getAspirantProfile = asyncHandler(async (req, res) => {
  const aspirant = await Aspirant.findOne({
    where: { userId: req.user.id },
    include: [
      { model: User, as: "user", attributes: ["email", "phone", "role", "status"] },
      { model: Education, as: "education" },
    ],
  });

  if (!aspirant) {
    return res.status(404).json({ message: "Aspirant profile not found" });
  }

  return res.status(200).json({ data: aspirant });
});

const updateAspirantProfile = asyncHandler(async (req, res) => {
  const aspirant = await Aspirant.findOne({ where: { userId: req.user.id } });

  if (!aspirant) {
    return res.status(404).json({ message: "Aspirant profile not found" });
  }

  await aspirant.update(req.body);

  const updated = await Aspirant.findOne({
    where: { id: aspirant.id },
    include: [
      { model: User, as: "user", attributes: ["email", "phone", "role", "status"] },
      { model: Education, as: "education" },
    ],
  });

  return res.status(200).json({ message: "Profile updated successfully", data: updated });
});

const getAllAspirants = asyncHandler(async (req, res) => {
  const aspirants = await Aspirant.findAll({
    include: [
      { model: User, as: "user", attributes: ["email", "phone", "role", "status"] },
      { model: Education, as: "education" },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: aspirants });
});

const getAspirantById = asyncHandler(async (req, res) => {
  const aspirant = await Aspirant.findByPk(req.params.id, {
    include: [
      { model: User, as: "user", attributes: ["email", "phone", "role", "status"] },
      { model: Education, as: "education" },
    ],
  });

  if (!aspirant) {
    return res.status(404).json({ message: "Aspirant profile not found" });
  }

  return res.status(200).json({ data: aspirant });
});

const updateAspirant = asyncHandler(async (req, res) => {
  const aspirant = await Aspirant.findByPk(req.params.id);

  if (!aspirant) {
    return res.status(404).json({ message: "Aspirant profile not found" });
  }

  await aspirant.update(req.body);
  return res.status(200).json({ message: "Aspirant updated successfully", data: aspirant });
});

const deleteAspirant = asyncHandler(async (req, res) => {
  const aspirant = await Aspirant.findByPk(req.params.id);

  if (!aspirant) {
    return res.status(404).json({ message: "Aspirant profile not found" });
  }

  const userId = aspirant.userId;
  await aspirant.destroy();

  if (userId) {
    await TalentId.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });
  }

  return res.status(200).json({ message: "Aspirant deleted successfully" });
});

const shareAspirants = asyncHandler(async (req, res) => {
  const { instituteIds } = req.body;
  if (!Array.isArray(instituteIds)) {
    return res.status(400).json({ message: "instituteIds must be an array" });
  }

  await AspirantShare.destroy({ where: {} });

  if (instituteIds.length > 0) {
    const records = instituteIds.map((id) => ({ instituteId: id }));
    await AspirantShare.bulkCreate(records);
  }

  return res.status(200).json({ message: "Aspirant list sharing updated successfully" });
});

const getAspirantShares = asyncHandler(async (req, res) => {
  const shares = await AspirantShare.findAll();
  const instituteIds = shares.map((s) => s.instituteId);
  return res.status(200).json({ data: instituteIds });
});

const getSharedAspirantsForInstitute = asyncHandler(async (req, res) => {
  const institute = await Institute.findOne({ where: { userId: req.user.id } });
  if (!institute) {
    return res.status(404).json({ message: "Institute profile not found" });
  }

  const share = await AspirantShare.findOne({ where: { instituteId: institute.id } });

  if (!share) {
    return res.status(200).json({ isShared: false, data: [] });
  }

  const aspirants = await Aspirant.findAll({
    include: [
      { model: User, as: "user", attributes: ["email", "phone", "role", "status"] },
      { model: Education, as: "education" },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ isShared: true, data: aspirants });
});

module.exports = {
  getAspirantProfile,
  updateAspirantProfile,
  getAllAspirants,
  getAspirantById,
  updateAspirant,
  deleteAspirant,
  shareAspirants,
  getAspirantShares,
  getSharedAspirantsForInstitute,
};
