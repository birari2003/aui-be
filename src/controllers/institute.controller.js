const asyncHandler = require("../utils/async-handler");
const { Institute, Booking, Professional } = require("../../models");
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

  return res.status(200).json({
    message: created ? "Institute profile created" : "Institute profile updated",
    data: institute,
  });
});

const createBooking = asyncHandler(async (req, res) => {
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
};
