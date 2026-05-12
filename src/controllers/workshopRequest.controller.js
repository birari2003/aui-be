const { WorkshopRequest, Institute, InstituteWorkshop } = require("../../models");

exports.createRequest = async (req, res) => {
  try {
    const { 
      workshopId, 
      workshopTitle, 
      category, 
      studentCount, 
      preferredMonth, 
      contactPerson, 
      email, 
      specialRequirements,
      requestType,
      professionalId
    } = req.body;

    // Get institute from authenticated user
    const institute = await Institute.findOne({ where: { userId: req.user.id } });
    if (!institute) {
      return res.status(404).json({ success: false, message: "Institute profile not found" });
    }

    const request = await WorkshopRequest.create({
      instituteId: institute.id,
      workshopId,
      workshopTitle,
      category,
      studentCount,
      preferredMonth,
      contactPerson,
      email,
      specialRequirements,
      status: 'pending',
      requestType: requestType || 'workshop',
      professionalId
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInstituteRequests = async (req, res) => {
  try {
    const institute = await Institute.findOne({ where: { userId: req.user.id } });
    if (!institute) {
      return res.status(404).json({ success: false, message: "Institute profile not found" });
    }

    const requests = await WorkshopRequest.findAll({
      where: { instituteId: institute.id },
      include: [
        { model: require("../../models").Professional, as: 'professional' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await WorkshopRequest.findAll({
      include: [
        { model: Institute, as: 'institute' },
        { model: require("../../models").Professional, as: 'professional' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await WorkshopRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await request.update({ status });
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
