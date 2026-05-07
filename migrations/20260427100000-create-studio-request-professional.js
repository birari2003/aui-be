"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("studio_request_professional", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "studios", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "professionals", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      project_timeline: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      production_type: {
        type: Sequelize.ENUM("film", "tv", "web", "ads", "other"),
        allowNull: false,
        defaultValue: "film",
      },
      engagement_brief: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      proposed_budget: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("studio_request_professional", ["studio_id"]);
    await queryInterface.addIndex("studio_request_professional", ["professional_id"]);
    await queryInterface.addIndex("studio_request_professional", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("studio_request_professional");
  },
};
