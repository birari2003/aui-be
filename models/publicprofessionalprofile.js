"use strict";

module.exports = (sequelize, DataTypes) => {
  const PublicProfessionalProfile = sequelize.define(
    "PublicProfessionalProfile",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      auiInsight: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experienceTimeline: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      showreelType: {
        type: DataTypes.ENUM("youtube", "direct"),
        allowNull: true,
        defaultValue: "youtube",
      },
      showreelUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      showreelTitle: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      showreelDuration: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      workLedger: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      workLedgerImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "public_professional_profiles",
      underscored: true,
    }
  );

  PublicProfessionalProfile.associate = (models) => {
    PublicProfessionalProfile.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return PublicProfessionalProfile;
};
