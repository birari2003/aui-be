"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("studio_job_postings", {
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
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      project_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      experience_required: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      artist_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("open", "paused", "closed"),
        allowNull: false,
        defaultValue: "open",
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

    await queryInterface.addIndex("studio_job_postings", ["studio_id"]);
    await queryInterface.addIndex("studio_job_postings", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("studio_job_postings");
  },
};
