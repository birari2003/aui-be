"use strict";

module.exports = (sequelize, DataTypes) => {
  const PublicStudioProfile = sequelize.define(
    "PublicStudioProfile",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bannerImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      specialty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      projectsCompleted: {
        type: DataTypes.STRING,
        defaultValue: '0',
      },
      artistsHired: {
        type: DataTypes.STRING,
        defaultValue: '0',
      },
      yearsActive: {
        type: DataTypes.STRING,
        defaultValue: '0',
      },
      awardsWon: {
        type: DataTypes.STRING,
        defaultValue: '0',
      },
      whatWeDo: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      services: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      whyWorkWithUs: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      studioReelUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      extraVideos: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      projects: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      clients: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      tableName: "public_studio_profiles",
      underscored: true,
    }
  );

  PublicStudioProfile.associate = (models) => {
    PublicStudioProfile.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return PublicStudioProfile;
};
