"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("professional", "studio", "institute", "admin"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "users",
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Professional, { foreignKey: "userId", as: "professional" });
    User.hasOne(models.Studio, { foreignKey: "userId", as: "studio" });
    User.hasOne(models.Institute, { foreignKey: "userId", as: "institute" });
    User.hasMany(models.Reel, { foreignKey: "userId", as: "reels" });
    User.hasMany(models.OtpVerification, { foreignKey: "userId", as: "otps" });
  };

  return User;
};
