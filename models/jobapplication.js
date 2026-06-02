"use strict";

module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define(
    "JobApplication",
    {
      studioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jobPostingId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable if it's a direct request not linked to a global post
      },
      studioRequestId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Link to direct request table if applicable
      },
      status: {
        type: DataTypes.ENUM("applied", "shortlisted", "discussion", "agreement", "hired", "rejected"),
        allowNull: false,
        defaultValue: "applied",
      },
      verifiedResponse: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      agreementDetails: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      artistDecision: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      contactInfoShared: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "job_applications",
      underscored: true,
      hooks: {
        afterCreate: async (instance, options) => {
          if (instance.jobPostingId) {
            try {
              const count = await sequelize.models.JobApplication.count({
                where: {
                  jobPostingId: instance.jobPostingId,
                  status: "hired",
                },
                transaction: options.transaction,
              });
              await sequelize.models.StudioJobPosting.update(
                { filledCount: count },
                {
                  where: { id: instance.jobPostingId },
                  transaction: options.transaction,
                }
              );
            } catch (err) {
              console.error("Error in JobApplication afterCreate hook:", err);
            }
          }
        },
        afterUpdate: async (instance, options) => {
          if (instance.jobPostingId) {
            try {
              const count = await sequelize.models.JobApplication.count({
                where: {
                  jobPostingId: instance.jobPostingId,
                  status: "hired",
                },
                transaction: options.transaction,
              });
              await sequelize.models.StudioJobPosting.update(
                { filledCount: count },
                {
                  where: { id: instance.jobPostingId },
                  transaction: options.transaction,
                }
              );
            } catch (err) {
              console.error("Error in JobApplication afterUpdate hook:", err);
            }
          }
        },
        afterDestroy: async (instance, options) => {
          if (instance.jobPostingId) {
            try {
              const count = await sequelize.models.JobApplication.count({
                where: {
                  jobPostingId: instance.jobPostingId,
                  status: "hired",
                },
                transaction: options.transaction,
              });
              await sequelize.models.StudioJobPosting.update(
                { filledCount: count },
                {
                  where: { id: instance.jobPostingId },
                  transaction: options.transaction,
                }
              );
            } catch (err) {
              console.error("Error in JobApplication afterDestroy hook:", err);
            }
          }
        },
      },
    }
  );

  JobApplication.associate = (models) => {
    JobApplication.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
    JobApplication.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
    JobApplication.belongsTo(models.StudioJobPosting, { foreignKey: "jobPostingId", as: "jobPosting" });
    JobApplication.belongsTo(models.StudioRequestProfessional, { foreignKey: "studioRequestId", as: "studioRequest" });
  };

  return JobApplication;
};
