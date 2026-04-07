"use strict";

module.exports = (sequelize, DataTypes) => {
  const OtpVerification = sequelize.define(
    "OtpVerification",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otpCode: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      consumedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "otp_verifications",
    }
  );

  OtpVerification.associate = (models) => {
    OtpVerification.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return OtpVerification;
};
