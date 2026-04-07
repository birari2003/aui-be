const asyncHandler = require("../utils/async-handler");
const { Reel } = require("../../models");

const createReel = asyncHandler(async (req, res) => {
  const reel = await Reel.create({ ...req.body, userId: req.user.id });
  return res.status(201).json({ message: "Reel created", data: reel });
});

const listReels = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.type) where.type = req.query.type;

  const reels = await Reel.findAll({ where, order: [["createdAt", "DESC"]] });
  return res.status(200).json({ data: reels });
});

module.exports = {
  createReel,
  listReels,
};
