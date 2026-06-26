const asyncHandler = require("../utils/async-handler");
const { Professional, Studio, Institute } = require("../../models");

const stats = asyncHandler(async (_req, res) => {
  const [professionals, studios, institutes] = await Promise.all([
    Professional.count(),
    Studio.count(),
    Institute.count(),
  ]);

  return res.status(200).json({
    data: {
      professionals,
      studios,
      institutes,
    },
  });
});

module.exports = {
  stats,
};
