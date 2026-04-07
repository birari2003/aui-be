"use strict";

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skillRequested: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      timeSlot: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      programType: {
        type: DataTypes.ENUM("workshop", "mentorship", "review"),
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      studentCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "bookings",
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.Institute, { foreignKey: "instituteId", as: "institute" });
    Booking.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  };

  return Booking;
};
