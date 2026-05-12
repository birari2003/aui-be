const { NexusOpportunity } = require("../../models");
const asyncHandler = require("../utils/async-handler");

// Admin: Create opportunity
const createOpportunity = asyncHandler(async (req, res) => {
  const { title, date, limit, tag, description } = req.body;
  
  const opportunity = await NexusOpportunity.create({
    title,
    date,
    limit,
    tag,
    description
  });

  return res.status(201).json({
    success: true,
    message: "Nexus opportunity created successfully",
    data: opportunity
  });
});

// Public/Institute: List opportunities
const listOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await NexusOpportunity.findAll({
    order: [["created_at", "DESC"]]
  });

  return res.status(200).json({
    success: true,
    data: opportunities
  });
});

// Admin: Update opportunity
const updateOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, limit, tag, description } = req.body;

  const opportunity = await NexusOpportunity.findByPk(id);
  if (!opportunity) {
    return res.status(404).json({ success: false, message: "Opportunity not found" });
  }

  await opportunity.update({
    title,
    date,
    limit,
    tag,
    description
  });

  return res.status(200).json({
    success: true,
    message: "Nexus opportunity updated successfully",
    data: opportunity
  });
});

// Admin: Delete opportunity
const deleteOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const opportunity = await NexusOpportunity.findByPk(id);
  if (!opportunity) {
    return res.status(404).json({ success: false, message: "Opportunity not found" });
  }

  await opportunity.destroy();

  return res.status(200).json({
    success: true,
    message: "Nexus opportunity deleted successfully"
  });
});

module.exports = {
  createOpportunity,
  listOpportunities,
  updateOpportunity,
  deleteOpportunity
};
