const asyncHandler = require("../utils/async-handler");
const { Education } = require("../../models");

const listEducations = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.status !== undefined) {
    where.status = parseInt(req.query.status, 10);
  } else {
    // Default to active educations
    where.status = 1;
  }

  const educations = await Education.findAll({
    where,
    order: [
      ["sortOrder", "ASC"],
      ["id", "ASC"],
    ],
  });

  return res.status(200).json({ data: educations });
});

const getEducationById = asyncHandler(async (req, res) => {
  const education = await Education.findByPk(req.params.id);

  if (!education) {
    return res.status(404).json({ message: "Education record not found" });
  }

  return res.status(200).json({ data: education });
});

const createEducation = asyncHandler(async (req, res) => {
  const { title, category, description, sortOrder, status } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: "Title and Category are required" });
  }

  const education = await Education.create({
    title,
    category,
    description: description || null,
    sortOrder: sortOrder || 0,
    status: status !== undefined ? status : 1,
  });

  return res.status(201).json({ message: "Education record created", data: education });
});

const updateEducation = asyncHandler(async (req, res) => {
  const education = await Education.findByPk(req.params.id);

  if (!education) {
    return res.status(404).json({ message: "Education record not found" });
  }

  await education.update(req.body);
  return res.status(200).json({ message: "Education record updated", data: education });
});

const deleteEducation = asyncHandler(async (req, res) => {
  const education = await Education.findByPk(req.params.id);

  if (!education) {
    return res.status(404).json({ message: "Education record not found" });
  }

  await education.destroy();
  return res.status(200).json({ message: "Education record deleted" });
});

module.exports = {
  listEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
