"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns
    await queryInterface.addColumn("studio_request_professional", "role_title", {
      type: Sequelize.STRING(150),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_request_professional", "project_format", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_request_professional", "opportunity_overview", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("studio_request_professional", "role_requirements", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("studio_request_professional", "start_availability", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_request_professional", "work_mode", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_request_professional", "location", {
      type: Sequelize.STRING(150),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_request_professional", "include_compensation", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("studio_request_professional", "verification_fields", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Change production_type from ENUM to STRING
    await queryInterface.changeColumn("studio_request_professional", "production_type", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // Make old columns nullable
    await queryInterface.changeColumn("studio_request_professional", "project_timeline", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.changeColumn("studio_request_professional", "engagement_brief", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("studio_request_professional", "role_title");
    await queryInterface.removeColumn("studio_request_professional", "project_format");
    await queryInterface.removeColumn("studio_request_professional", "opportunity_overview");
    await queryInterface.removeColumn("studio_request_professional", "role_requirements");
    await queryInterface.removeColumn("studio_request_professional", "start_availability");
    await queryInterface.removeColumn("studio_request_professional", "work_mode");
    await queryInterface.removeColumn("studio_request_professional", "location");
    await queryInterface.removeColumn("studio_request_professional", "include_compensation");
    await queryInterface.removeColumn("studio_request_professional", "verification_fields");

    // Revert production_type to ENUM (This might be tricky if data exists, but for now we follow standard revert)
    await queryInterface.changeColumn("studio_request_professional", "production_type", {
      type: Sequelize.ENUM("film", "tv", "web", "ads", "other"),
      allowNull: false,
      defaultValue: "film",
    });

    await queryInterface.changeColumn("studio_request_professional", "project_timeline", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.changeColumn("studio_request_professional", "engagement_brief", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
