const express = require("express");
const router = express.Router();
const specialRequestController = require("../controllers/specialRequest.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.post("/professional", specialRequestController.createProfessionalSpecialRequest);
router.post("/institute", specialRequestController.createInstituteSpecialRequest);
router.post("/share", specialRequestController.shareProfessionalToInstitute);
router.get("/", specialRequestController.getAllSpecialRequests);
router.get("/my", specialRequestController.getMySpecialRequests);
router.patch("/:id/status", specialRequestController.updateSpecialRequestStatus);

module.exports = router;
