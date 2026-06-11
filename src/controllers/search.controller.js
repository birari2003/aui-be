const { Op } = require("sequelize");
const asyncHandler = require("../utils/async-handler");
const { Professional, User, Availability, TalentId, Institute, StudioJobPosting, Studio, TalentId: StudioTalentId, TalentBench, JobApplication } = require("../../models");

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

  if (skill) {
    const skillWords = skill.trim().split(/\s+/).filter(Boolean);
    if (skillWords.length === 1) {
      where.primarySkill = { [Op.like]: `%${skillWords[0]}%` };
    } else {
      where[Op.or] = skillWords.map((word) => ({
        primarySkill: { [Op.like]: `%${word}%` },
      }));
    }
  }
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
    {
      model: TalentBench,
      as: "savedByStudios",
      attributes: ["id"]
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

const searchStudioJobPostings = asyncHandler(async (req, res) => {
  const { title, projectType, status } = req.query;

  const where = {};
  if (title) where.title = { [Op.like]: `%${title}%` };
  if (projectType) where.projectType = { [Op.like]: `%${projectType}%` };
  if (status) where.status = status;

  const rows = await StudioJobPosting.findAll({
    where,
    include: [
      {
        model: Studio,
        as: "studio",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "status"],
            include: [{ model: StudioTalentId, as: "talentId" }],
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

module.exports = {
  searchProfessionals,
  searchInstitutes,
  searchStudioJobPostings,
};
