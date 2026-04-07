const express = require("express");
const controller = require("../controllers/collaboration.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("professional", "institute"),
  controller.sendRequest
);

router.get(
  "/my-requests",
  protect,
  authorizeRoles("professional", "institute"),
  controller.getMyRequests
);

router.patch(
  "/:id/respond",
  protect,
  authorizeRoles("professional", "institute"),
  controller.respondToRequest
);

module.exports = router;
