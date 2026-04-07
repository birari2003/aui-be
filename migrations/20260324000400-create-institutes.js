"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("institutes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      institute_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      contact_person: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      student_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      branch_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      courses_offered: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      conducts_workshops: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      industry_exposure: {
        type: Sequelize.ENUM("regularly", "occasionally", "never"),
        allowNull: true,
      },
      years_in_education: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      support_needed: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      active_services: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      verification_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      requirements: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      verification_status: {
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
    await queryInterface.dropTable("institutes");
  },
};
