const express = require("express");
const {
  listEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/education.controller");

const router = express.Router();

router.get("/", listEducations);
router.get("/:id", getEducationById);
router.post("/", createEducation);
router.put("/:id", updateEducation);
router.delete("/:id", deleteEducation);

module.exports = router;
