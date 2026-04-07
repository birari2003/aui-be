const express = require("express");
const controller = require("../controllers/reel.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", controller.listReels);
router.post("/", protect, controller.createReel);

module.exports = router;
