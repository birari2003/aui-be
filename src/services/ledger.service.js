const { WorkLedger } = require("../../models");

async function createLedgerFromEngagement(engagement) {
  return WorkLedger.create({
    professionalId: engagement.professionalId,
    organizationType: "studio",
    organizationId: engagement.studioId,
    projectName: engagement.projectName,
    role: engagement.role,
    duration: engagement.endDate
      ? `${engagement.startDate} to ${engagement.endDate}`
      : `${engagement.startDate}`,
    completionDate: engagement.endDate || new Date(),
  });
}

async function createLedgerFromBooking(booking) {
  return WorkLedger.create({
    professionalId: booking.professionalId,
    organizationType: "institute",
    organizationId: booking.instituteId,
    projectName: booking.topic || `${booking.programType} session`,
    role: booking.programType,
    duration: booking.duration || booking.timeSlot || "scheduled",
    completionDate: booking.bookingDate,
  });
}

module.exports = {
  createLedgerFromEngagement,
  createLedgerFromBooking,
};
