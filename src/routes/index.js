const express = require("express");

const authRoutes = require("./auth.routes");
const professionalRoutes = require("./professional.routes");
const studioRoutes = require("./studio.routes");
const instituteRoutes = require("./institute.routes");
const searchRoutes = require("./search.routes");
const adminRoutes = require("./admin.routes");
const reelRoutes = require("./reel.routes");
const collaborationRoutes = require("./collaboration.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/professionals", professionalRoutes);
router.use("/studios", studioRoutes);
router.use("/institutes", instituteRoutes);
router.use("/search", searchRoutes);
router.use("/admin", adminRoutes);
router.use("/reels", reelRoutes);
router.use("/collaboration", collaborationRoutes);

module.exports = router;
