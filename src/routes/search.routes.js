const express = require("express");
const controller = require("../controllers/search.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/professionals",
  protect,
  authorizeRoles("studio", "institute"),
  controller.searchProfessionals
);

router.get(
  "/institutes",
  protect,
  authorizeRoles("professional", "studio"),
  controller.searchInstitutes
);

router.get(
  "/studio-job-postings",
  protect,
  authorizeRoles("professional", "studio", "institute"),
  controller.searchStudioJobPostings
);

module.exports = router;
