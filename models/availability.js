"use strict";

module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define(
    "Availability",
    {
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "availabilities",
      indexes: [
        {
          unique: true,
          fields: ["professional_id", "date"],
        },
      ],
    }
  );

  Availability.associate = (models) => {
    Availability.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  };

  return Availability;
};
