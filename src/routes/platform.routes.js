const express = require("express");
const controller = require("../controllers/platform.controller");

const router = express.Router();

router.get("/stats", controller.stats);

module.exports = router;
