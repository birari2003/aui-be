const asyncHandler = require("../utils/async-handler");
const { Professional, Studio, Institute, Aspirant } = require("../../models");

const stats = asyncHandler(async (_req, res) => {
  const [professionals, aspirants, studios, institutes] = await Promise.all([
    Professional.count(),
    Aspirant.count(),
    Studio.count(),
    Institute.count(),
  ]);

  return res.status(200).json({
    data: {
      professionals,
      aspirants,
      studios,
      institutes,
    },
  });
});

module.exports = {
  stats,
};
