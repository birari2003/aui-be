"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("studio_job_postings", "production_type", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "project_format", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "engagement_type", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "work_mode", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "location_preference", {
      type: Sequelize.STRING(150),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "time_zone_preference", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "required_availability", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "opportunity_overview", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "software_tools", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "required_experience", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "internal_notes", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "verification_fields", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "filled_count", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("studio_job_postings", "production_type");
    await queryInterface.removeColumn("studio_job_postings", "project_format");
    await queryInterface.removeColumn("studio_job_postings", "engagement_type");
    await queryInterface.removeColumn("studio_job_postings", "work_mode");
    await queryInterface.removeColumn("studio_job_postings", "location_preference");
    await queryInterface.removeColumn("studio_job_postings", "time_zone_preference");
    await queryInterface.removeColumn("studio_job_postings", "required_availability");
    await queryInterface.removeColumn("studio_job_postings", "opportunity_overview");
    await queryInterface.removeColumn("studio_job_postings", "software_tools");
    await queryInterface.removeColumn("studio_job_postings", "required_experience");
    await queryInterface.removeColumn("studio_job_postings", "internal_notes");
    await queryInterface.removeColumn("studio_job_postings", "verification_fields");
    await queryInterface.removeColumn("studio_job_postings", "filled_count");
  },
};
