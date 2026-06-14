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
  JobApplication,
} = require("../../models");
const { createLedgerFromEngagement } = require("../services/ledger.service");

const listJobApplications = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const { jobPostingId, status } = req.query;

  const where = { studioId: studio.id };
  if (jobPostingId) where.jobPostingId = jobPostingId;
  if (status) where.status = status;

  const applications = await JobApplication.findAll({
    where,
    include: [
      {
        model: Professional,
        as: "professional",
        include: [
          { 
            model: User, 
            as: "user", 
            attributes: ["email", "phone"],
            include: [{ model: TalentId, as: "talentId" }]
          }
        ],
      },
      { model: StudioJobPosting, as: "jobPosting" },  
    ],
    order: [["updatedAt", "DESC"]],
  });

  return res.status(200).json({ data: applications });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const application = await JobApplication.findOne({
    where: { id: req.params.applicationId, studioId: studio.id },
  });

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  const { status, contactInfoShared } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (contactInfoShared !== undefined) updates.contactInfoShared = contactInfoShared;

  await application.update(updates);

  return res.status(200).json({ message: "Application status updated", data: application });
});

const finalizeAgreement = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const application = await JobApplication.findOne({
    where: { id: req.params.applicationId, studioId: studio.id },
  });

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  const { agreementDetails } = req.body;

  await application.update({
    agreementDetails,
    status: "agreement",
    artistDecision: "pending",
  });

  return res.status(200).json({ message: "Agreement finalized and sent to artist", data: application });
});

async function getStudioByUser(userId) {
  return Studio.findOne({
    where: { userId },
    include: [{ model: User, as: "user", attributes: ["email", "phone"] }]
  });
}

const getProfile = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  // Return 200 even if not found, to avoid frontend fetch errors for new profiles
  return res.status(200).json({ ok: true, data: studio || null });
});

const upsertProfile = asyncHandler(async (req, res) => {
  const payload = req.body;

  const [studio, created] = await Studio.findOrCreate({
    where: { userId: req.user.id },
    defaults: { ...payload, userId: req.user.id },
  });

  if (!created) {
    await studio.update(payload);
  }

  if (payload.phone !== undefined) {
    await User.update({ phone: payload.phone }, { where: { id: req.user.id } });
  }

  const [talentId] = await TalentId.findOrCreate({
    where: { userId: req.user.id },
    defaults: {
      userId: req.user.id,
      talentCode: `AUI-STU-${String(req.user.id).padStart(6, "0")}`,
    },
  });

  // Fetch updated studio info with user association to return in response
  const updatedStudio = await getStudioByUser(req.user.id);

  return res.status(200).json({
    message: created ? "Studio profile created" : "Studio profile updated",
    data: {
      studio: updatedStudio,
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

  const { professionalId, professionalIds, ...payload } = req.body;

  // Normalize to an array of professional IDs
  const targetIds = professionalIds || (professionalId ? [professionalId] : []);

  if (targetIds.length === 0) {
    return res.status(400).json({ message: "No professionals selected" });
  }

  // Check if all professionals are in the bench
  const benchEntries = await TalentBench.findAll({
    where: {
      studioId: studio.id,
      professionalId: targetIds,
    },
  });

  const benchedIds = new Set(benchEntries.map((b) => b.professionalId));
  const missingFromBench = targetIds.filter((id) => !benchedIds.has(Number(id)));

  if (missingFromBench.length > 0) {
    return res.status(400).json({
      message: "Some professionals are not in your bench",
      missingFromBench,
    });
  }

  // Create requests for each professional
  const requests = await Promise.all(
    targetIds.map((pid) =>
      StudioRequestProfessional.create({
        ...payload,
        studioId: studio.id,
        professionalId: pid,
      })
    )
  );

  return res.status(201).json({
    message: targetIds.length > 1 ? "Engagement requests sent to multiple artists" : "Engagement request sent",
    data: requests,
  });
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

const updateStudioRequestProfessional = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await StudioRequestProfessional.findOne({
    where: { id: req.params.id, studioId: studio.id },
  });

  if (!row) {
    return res.status(404).json({ message: "Studio request not found" });
  }

  await row.update(req.body);

  return res.status(200).json({ message: "Studio request updated", data: row });
});


const createStudioJobPosting = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await StudioJobPosting.create({
    ...req.body,
    studioId: studio.id,
  });

  return res.status(201).json({ message: "Job posted successfully", data: row });
});

const updateStudioJobPosting = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await StudioJobPosting.findOne({
    where: { id: req.params.id, studioId: studio.id },
  });

  if (!row) {
    return res.status(404).json({ message: "Job posting not found" });
  }

  await row.update(req.body);

  return res.status(200).json({ message: "Job posting updated", data: row });
});

const deleteStudioJobPosting = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await StudioJobPosting.findOne({
    where: { id: req.params.id, studioId: studio.id },
  });

  if (!row) {
    return res.status(404).json({ message: "Job posting not found" });
  }

  await row.destroy();

  return res.status(200).json({ message: "Job posting deleted successfully" });
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

const uploadJobPostingAttachments = asyncHandler(async (req, res) => {
  const studio = await getStudioByUser(req.user.id);
  if (!studio) {
    return res.status(404).json({ message: "Studio profile not found" });
  }

  const row = await StudioJobPosting.findOne({
    where: { id: req.params.id, studioId: studio.id },
  });

  if (!row) {
    return res.status(404).json({ message: "Job posting not found" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const newPaths = req.files.map((f) => `/${f.path}`);
  const existing = row.attachments || [];
  const merged = [...existing, ...newPaths];

  await row.update({ attachments: merged });

  return res.status(200).json({
    message: "Attachments uploaded successfully",
    data: { attachments: merged },
  });
});

module.exports = {
  getProfile,
  upsertProfile,
  createEngagement,
  updateEngagementStatus,
  listEngagements,
  saveTalent,
  removeTalent,
  listTalentBench,
  createStudioRequestProfessional,
  listStudioRequestProfessional,
  updateStudioRequestProfessional,
  createStudioJobPosting,
  updateStudioJobPosting,
  deleteStudioJobPosting,
  listStudioJobPostings,
  createHiringRequest,
  uploadJobPostingAttachments,
  listJobApplications,
  updateApplicationStatus,
  finalizeAgreement,
};
