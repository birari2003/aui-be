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

module.exports = router;
