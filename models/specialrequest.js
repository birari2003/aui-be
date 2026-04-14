"use strict";
module.exports = (sequelize, DataTypes) => {
  const SpecialRequest = sequelize.define(
    "SpecialRequest",
    {
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "professional_id",
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "institute_id",
      },
      senderRole: {
        type: DataTypes.ENUM("professional", "institute", "admin"),
        allowNull: false,
        defaultValue: "professional",
        field: "sender_role",
      },
      professionalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "professional_name",
      },
      professionalPublicUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "professional_public_url",
      },
      institutePublicUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "institute_public_url",
      },
      mentorshipTime: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "mentorship_time",
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "contacted", "closed", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      responseMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "response_message",
      },
    },
    {
      tableName: "special_requests",
      underscored: true,
    }
  );

  SpecialRequest.associate = (models) => {
    SpecialRequest.belongsTo(models.Professional, {
      foreignKey: "professional_id",
      as: "professional",
    });
    SpecialRequest.belongsTo(models.Institute, {
      foreignKey: "institute_id",
      as: "institute",
    });
  };

  return SpecialRequest;
};
