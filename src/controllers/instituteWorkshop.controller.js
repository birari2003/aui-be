const { InstituteWorkshop } = require("../../models");

exports.createWorkshop = async (req, res) => {
  try {
    const { category, title, duration, level, pillars, outcome, rate, modelType } = req.body;
    const workshop = await InstituteWorkshop.create({
      category,
      title,
      duration,
      level,
      pillars: Array.isArray(pillars) ? JSON.stringify(pillars) : pillars,
      outcome,
      rate,
      modelType,
    });
    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllWorkshops = async (req, res) => {
  try {
    const workshops = await InstituteWorkshop.findAll();
    
    // Parse pillars if needed
    const parsedWorkshops = workshops.map(w => {
      const plain = w.get({ plain: true });
      if (plain.pillars) {
        try {
          plain.pillars = JSON.parse(plain.pillars);
        } catch (e) {
          plain.pillars = [];
        }
      }
      return plain;
    });

    res.status(200).json({ success: true, data: parsedWorkshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, duration, level, pillars, outcome, rate, modelType } = req.body;
    
    const workshop = await InstituteWorkshop.findByPk(id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }

    await workshop.update({
      category,
      title,
      duration,
      level,
      pillars: Array.isArray(pillars) ? JSON.stringify(pillars) : pillars,
      outcome,
      rate,
      modelType,
    });

    res.status(200).json({ success: true, data: workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await InstituteWorkshop.findByPk(id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }

    await workshop.destroy();
    res.status(200).json({ success: true, message: "Workshop deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
