const asyncHandler = require("../utils/async-handler");
const { Institute, Booking, Professional, TalentId, User } = require("../../models");
const { createLedgerFromBooking } = require("../services/ledger.service");

async function getInstituteByUser(userId) {
  return Institute.findOne({ where: { userId } });
}

const upsertProfile = asyncHandler(async (req, res) => {
  const payload = req.body;

  const [institute, created] = await Institute.findOrCreate({
    where: { userId: req.user.id },
    defaults: { ...payload, userId: req.user.id },
  });

  if (!created) {
    await institute.update(payload);
  }

  if (payload.phone !== undefined) {
    await User.update({ phone: payload.phone }, { where: { id: req.user.id } });
  }

  const reloaded = await Institute.findOne({ where: { id: institute.id } });

  const [talentId] = await TalentId.findOrCreate({
    where: { userId: req.user.id },
    defaults: {
      userId: req.user.id,
      talentCode: `AUI-INST-${String(req.user.id).padStart(6, "0")}`,
    },
  });

  return res.status(200).json({
    message: created ? "Institute profile created" : "Institute profile updated",
    data: {
      profile: reloaded,
      talentId,
    },
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  let profile = await Institute.findOne({
    where: { userId: req.user.id },
    include: [
      { 
        model: User, 
        as: "user", 
        include: [{ model: TalentId, as: "talentId" }] 
      },
      { model: Booking, as: "bookings", include: [{ model: Professional, as: "professional" }] },
    ],
  });

  if (!profile) {
    return res.status(404).json({ message: "Institute profile not found" });
  }

  // Ensure TalentId exists
  if (!profile.user?.talentId) {
    await TalentId.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        userId: req.user.id,
        talentCode: `AUI-INST-${String(req.user.id).padStart(6, "0")}`,
      },
    });
    // Re-fetch to include association
    profile = await Institute.findOne({
      where: { userId: req.user.id },
      include: [
        { 
          model: User, 
          as: "user", 
          include: [{ model: TalentId, as: "talentId" }] 
        },
        { model: Booking, as: "bookings", include: [{ model: Professional, as: "professional" }] },
      ],
    });
  }

  return res.status(200).json({ data: profile });
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const { talentCode } = req.params;

  const talentId = await TalentId.findOne({
    where: { talentCode },
    include: [
      {
        model: User,
        as: "user",
        include: [
          {
            model: Institute,
            as: "institute",
            include: [
              { model: Booking, as: "bookings", include: [{ model: Professional, as: "professional" }] },
            ],
          },
        ],
      },
    ],
  });

  if (!talentId || !talentId.user?.institute) {
    return res.status(404).json({ message: "Institute profile not found" });
  }

  return res.status(200).json({ data: talentId.user.institute });
});

const createBooking = asyncHandler(async (req, res) => {
// ... existing code ...
  const institute = await getInstituteByUser(req.user.id);
  if (!institute) {
    return res.status(404).json({ message: "Institute profile not found" });
  }

  const booking = await Booking.create({ ...req.body, instituteId: institute.id });
  return res.status(201).json({ message: "Booking created", data: booking });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const institute = await getInstituteByUser(req.user.id);
  if (!institute) {
    return res.status(404).json({ message: "Institute profile not found" });
  }

  const booking = await Booking.findOne({
    where: { id: req.params.bookingId, instituteId: institute.id },
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  await booking.update({ status: req.body.status });

  if (req.body.status === "completed") {
    await createLedgerFromBooking(booking);
  }

  return res.status(200).json({ message: "Booking status updated", data: booking });
});

const listBookings = asyncHandler(async (req, res) => {
  const institute = await getInstituteByUser(req.user.id);
  if (!institute) {
    return res.status(404).json({ message: "Institute profile not found" });
  }

  const rows = await Booking.findAll({
    where: { instituteId: institute.id },
    include: [{ model: Professional, as: "professional" }],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: rows });
});

module.exports = {
  upsertProfile,
  createBooking,
  updateBookingStatus,
  listBookings,
  getMyProfile,
  getPublicProfile,
};
