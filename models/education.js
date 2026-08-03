"use strict";

module.exports = (sequelize, DataTypes) => {
  const Education = sequelize.define(
    "Education",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 0 = Inactive, 1 = Active
      },
    },
    {
      tableName: "Educations",
      timestamps: true,
      paranoid: true,
    }
  );

  return Education;
};
