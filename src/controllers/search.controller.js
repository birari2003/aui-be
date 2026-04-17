const { Op } = require("sequelize");
const asyncHandler = require("../utils/async-handler");
const { Professional, User, Availability, TalentId, Institute } = require("../../models");

const searchProfessionals = asyncHandler(async (req, res) => {
  const {
    skill,
    role,
    level,
    minExperience,
    maxExperience,
    availability,
    verified,
  } = req.query;

  const where = {};

  if (skill) where.primarySkill = { [Op.like]: `%${skill}%` };
  if (role) where.position = role;
  if (level) where.level = level;

  if (minExperience || maxExperience) {
    where.experienceYears = {};
    if (minExperience) where.experienceYears[Op.gte] = Number(minExperience);
    if (maxExperience) where.experienceYears[Op.lte] = Number(maxExperience);
  }

  if (verified === "true") where.verificationStatus = true;
  if (verified === "false") where.verificationStatus = false;

  const include = [
    { 
      model: User, 
      as: "user", 
      attributes: ["id", "email", "status"],
      include: [{ model: TalentId, as: "talentId" }]
    },
  ];

  if (availability) {
    include.push({
      model: Availability,
      as: "availabilities",
      where: { date: availability, isAvailable: true },
      required: true,
    });
  }

  const rows = await Professional.findAll({
    where,
    include,
    order: [["experienceYears", "DESC"]],
  });

  return res.status(200).json({ data: rows });
});

const searchInstitutes = asyncHandler(async (req, res) => {
  const { name, location, courses } = req.query;

  const where = {};
  if (name) where.instituteName = { [Op.like]: `%${name}%` };
  if (location) where.location = { [Op.like]: `%${location}%` };
  if (courses) where.coursesOffered = { [Op.like]: `%${courses}%` };

  const rows = await Institute.findAll({
    where,
    include: [
      { 
        model: User, 
        as: "user", 
        attributes: ["id", "email", "status"],
        include: [{ model: TalentId, as: "talentId" }]
      },
    ],
    order: [["instituteName", "ASC"]],
  });

  return res.status(200).json({ data: rows });
});

module.exports = {
  searchProfessionals,
  searchInstitutes,
};
