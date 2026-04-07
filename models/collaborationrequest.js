"use strict";
module.exports = (sequelize, DataTypes) => {
  const CollaborationRequest = sequelize.define(
    "CollaborationRequest",
    {
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "professional_id",
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "institute_id",
      },
      senderRole: {
        type: DataTypes.ENUM("professional", "institute"),
        allowNull: false,
        field: "sender_role",
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      proposedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "proposed_date",
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      responseMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "response_message",
      },
      publicUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "public_url",
      },
    },
    {
      tableName: "collaboration_requests",
      underscored: true,
    }
  );

  CollaborationRequest.associate = (models) => {
    CollaborationRequest.belongsTo(models.Professional, {
      foreignKey: "professional_id",
      as: "professional",
    });
    CollaborationRequest.belongsTo(models.Institute, {
      foreignKey: "institute_id",
      as: "institute",
    });
  };

  return CollaborationRequest;
};
