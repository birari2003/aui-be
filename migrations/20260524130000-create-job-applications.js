"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("job_applications", {
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "professionals", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      job_posting_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "studio_job_postings", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      studio_request_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "studio_request_professional", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("applied", "shortlisted", "discussion", "agreement", "hired", "rejected"),
        allowNull: false,
        defaultValue: "applied",
      },
      verified_response: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      agreement_details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      artist_decision: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      contact_info_shared: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("job_applications");
  },
};
