const express = require("express");

const authRoutes = require("./auth.routes");
const professionalRoutes = require("./professional.routes");
const studioRoutes = require("./studio.routes");
const instituteRoutes = require("./institute.routes");
const searchRoutes = require("./search.routes");
const adminRoutes = require("./admin.routes");
const reelRoutes = require("./reel.routes");
const collaborationRoutes = require("./collaboration.routes");
const specialRequestRoutes = require("./specialRequest.routes");
const publicProfileRoutes = require("./publicProfile.routes");
const studioPublicProfileRoutes = require("./studioProfile.routes");
const institutePublicProfileRoutes = require("./instituteProfile.routes");
const instituteWorkshopRoutes = require("./instituteWorkshop.routes");
const workshopRequestRoutes = require("./workshopRequest.routes");
const nexusRoutes = require("./nexus.routes");
const platformRoutes = require("./platform.routes");
const showreelRoutes = require("./showreel.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/professionals", professionalRoutes);
router.use("/studios", studioRoutes);
router.use("/institutes", instituteRoutes);
router.use("/search", searchRoutes);
router.use("/admin", adminRoutes);
router.use("/reels", reelRoutes);
router.use("/collaboration", collaborationRoutes);
router.use("/special-requests", specialRequestRoutes);
router.use("/public-profile", publicProfileRoutes);
router.use("/studio-public-profile", studioPublicProfileRoutes);
router.use("/institute-public-profile", institutePublicProfileRoutes);
router.use("/institute-workshops", instituteWorkshopRoutes);
router.use("/workshop-requests", workshopRequestRoutes);
router.use("/nexus", nexusRoutes);
router.use("/platform", platformRoutes);
router.use("/showreels", showreelRoutes);


module.exports = router;
