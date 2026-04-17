const { SpecialRequest, Professional, Institute, User, TalentId } = require("../../models");
const asyncHandler = require("../utils/async-handler");

const createProfessionalSpecialRequest = asyncHandler(async (req, res) => {
  const { professionalName, professionalPublicUrl, institutePublicUrl, mentorshipTime, message } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  if (role !== "professional") {
    return res.status(403).json({ message: "Only professionals can use this endpoint" });
  }

  const professional = await Professional.findOne({ where: { userId } });
  if (!professional) {
    return res.status(404).json({ message: "Professional profile not found" });
  }

  const request = await SpecialRequest.create({
    professionalId: professional.id,
    professionalName,
    professionalPublicUrl,
    institutePublicUrl,
    mentorshipTime,
    message,
    senderRole: "professional",
    status: "pending",
  });

  return res.status(201).json({
    message: "Special request submitted successfully",
    data: request,
  });
});

const createInstituteSpecialRequest = asyncHandler(async (req, res) => {
  const { professionalName, professionalPublicUrl, mentorshipTime, message } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  if (role !== "institute") {
    return res.status(403).json({ message: "Only institutes can use this endpoint" });
  }

  const institute = await Institute.findOne({ where: { userId } });
  if (!institute) {
    return res.status(404).json({ message: "Institute profile not found" });
  }

  const request = await SpecialRequest.create({
    instituteId: institute.id,
    professionalName,
    professionalPublicUrl,
    mentorshipTime,
    message,
    senderRole: "institute",
    status: "pending",
  });

  return res.status(201).json({
    message: "Special request submitted successfully",
    data: request,
  });
});

const getAllSpecialRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const requests = await SpecialRequest.findAll({
    include: [
      {
        model: Professional,
        as: "professional",
        attributes: ["id", "position"],
        include: [
          { 
            model: User, 
            as: "user", 
            attributes: ["email"],
            include: [{ model: TalentId, as: "talentId" }]
          }
        ],
      },
      {
        model: Institute,
        as: "institute",
        attributes: ["id", "instituteName"],
        include: [
          { 
            model: User, 
            as: "user", 
            attributes: ["email"],
            include: [{ model: TalentId, as: "talentId" }]
          }
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return res.status(200).json({ data: requests });
});

const getMySpecialRequests = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  if (role === "professional") {
    const professional = await Professional.findOne({ where: { userId } });
    if (!professional) {
      return res.status(404).json({ message: "Professional profile not found" });
    }

    const requests = await SpecialRequest.findAll({
      where: { professionalId: professional.id, senderRole: "professional" },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ data: requests });
  } else if (role === "institute") {
    const institute = await Institute.findOne({ where: { userId } });
    if (!institute) {
      return res.status(404).json({ message: "Institute profile not found" });
    }

    const requests = await SpecialRequest.findAll({
      where: { instituteId: institute.id },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ data: requests });
  } else if (role === "admin") {
    // Admin sees all their outbound shares or similar if needed, 
    // but for now, "my" for admin could be all requests they initiated?
    const requests = await SpecialRequest.findAll({
      where: { senderRole: "admin" },
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ data: requests });
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
});

const shareProfessionalToInstitute = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const { professionalId, instituteId, message } = req.body;

  const professional = await Professional.findByPk(professionalId, {
    include: [
      { 
        model: User, 
        as: "user", 
        attributes: ["email"],
        include: [{ model: TalentId, as: "talentId" }]
      }
    ],
  });
  if (!professional) {
    return res.status(404).json({ message: "Professional not found" });
  }

  const institute = await Institute.findByPk(instituteId);
  if (!institute) {
    return res.status(404).json({ message: "Institute not found" });
  }

  const request = await SpecialRequest.create({
    professionalId: professional.id,
    instituteId: institute.id,
    professionalName: professional.fullName || "Professional",
    professionalPublicUrl: professional.user?.talentId?.talentCode 
      ? `/talent/${professional.user.talentId.talentCode}`
      : (professional.portfolioUrl || professional.showreelUrl),
    message: message || `Admin shared this professional: ${professional.position || ""}`,
    senderRole: "admin",
    status: "pending",
  });

  return res.status(201).json({
    message: "Professional shared with institute successfully",
    data: request,
  });
});

const updateSpecialRequestStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const { id } = req.params;
  const { status, responseMessage } = req.body;

  const request = await SpecialRequest.findByPk(id);
  if (!request) {
    return res.status(404).json({ message: "Special request not found" });
  }

  request.status = status;
  if (responseMessage) {
    request.responseMessage = responseMessage;
  }
  await request.save();

  return res.status(200).json({
    message: `Special request status updated to ${status}`,
    data: request,
  });
});

module.exports = {
  createProfessionalSpecialRequest,
  createInstituteSpecialRequest,
  getAllSpecialRequests,
  getMySpecialRequests,
  updateSpecialRequestStatus,
  shareProfessionalToInstitute,
};
