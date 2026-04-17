const { CollaborationRequest, Professional, Institute, User, TalentId } = require("../../models");
const asyncHandler = require("../utils/async-handler");

const sendRequest = asyncHandler(async (req, res) => {
  const { receiverId, receiverRole, message, proposedDate, publicUrl } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  let professionalId, instituteId;

  if (userRole === "professional") {
    const prof = await Professional.findOne({ where: { userId } });
    if (!prof) return res.status(404).json({ message: "Professional profile not found" });
    professionalId = prof.id;
    instituteId = receiverId;
  } else if (userRole === "institute") {
    const inst = await Institute.findOne({ where: { userId } });
    if (!inst) return res.status(404).json({ message: "Institute profile not found" });
    instituteId = inst.id;
    professionalId = receiverId;
  } else {
    return res.status(403).json({ message: "Only professionals and institutes can send collaboration requests" });
  }

  const request = await CollaborationRequest.create({
    professionalId,
    instituteId,
    senderRole: userRole,
    message,
    proposedDate,
    publicUrl,
    status: "pending",
  });

  return res.status(201).json({ message: "Collaboration request sent successfully", data: request });
});

const getMyRequests = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let where = {};
  if (userRole === "professional") {
    const prof = await Professional.findOne({ where: { userId } });
    if (!prof) return res.status(404).json({ message: "Professional profile not found" });
    where.professionalId = prof.id;
  } else if (userRole === "institute") {
    const inst = await Institute.findOne({ where: { userId } });
    if (!inst) return res.status(404).json({ message: "Institute profile not found" });
    where.instituteId = inst.id;
  } else {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  const requests = await CollaborationRequest.findAll({
    where,
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
          },
        ]
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
          },
        ]
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return res.status(200).json({ data: requests });
});

const respondToRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, responseMessage } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  const request = await CollaborationRequest.findByPk(id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  // Verification: Can only respond to requests sent to you
  if (userRole === "professional") {
    const prof = await Professional.findOne({ where: { userId } });
    if (request.professionalId !== prof.id || request.senderRole !== "institute") {
      return res.status(403).json({ message: "Unauthorized to respond to this request" });
    }
  } else if (userRole === "institute") {
    const inst = await Institute.findOne({ where: { userId } });
    if (request.instituteId !== inst.id || request.senderRole !== "professional") {
      return res.status(403).json({ message: "Unauthorized to respond to this request" });
    }
  }

  request.status = status;
  request.responseMessage = responseMessage;
  await request.save();

  return res.status(200).json({ message: `Request ${status} successfully`, data: request });
});

module.exports = {
  sendRequest,
  getMyRequests,
  respondToRequest,
};
