"use strict";

module.exports = (sequelize, DataTypes) => {
  const InstituteWorkshop = sequelize.define(
    "InstituteWorkshop",
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pillars: {
        type: DataTypes.TEXT, // Stored as JSON string
        allowNull: true,
      },
      outcome: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      modelType: {
        type: DataTypes.ENUM("workshops", "mentorship", "portfolio"),
        allowNull: false,
        defaultValue: "workshops",
      },
    },
    {
      tableName: "institute_workshops",
      underscored: true,
    }
  );

  InstituteWorkshop.associate = (models) => {
    // No associations needed for global workshops
  };

  return InstituteWorkshop;
};
