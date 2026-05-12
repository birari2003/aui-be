const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/instituteWorkshop.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public or Admin restricted? 
// For now, let's allow authenticated users to see, but admin to manage.
// Actually, for "institute to see in their login", we need GET.
// For admin to manage, we need POST/PUT/DELETE.

router.get("/", workshopController.getAllWorkshops);
router.post("/", workshopController.createWorkshop);
router.put("/:id", workshopController.updateWorkshop);
router.delete("/:id", workshopController.deleteWorkshop);

module.exports = router;
