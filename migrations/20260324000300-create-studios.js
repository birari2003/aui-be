"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("studios", {
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
      studio_name: {
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
      team_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      years_in_operation: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      work_type: {
        type: Sequelize.ENUM("film", "series", "ads", "gaming"),
        allowNull: true,
      },
      hiring_frequency: {
        type: Sequelize.ENUM("frequent", "occasional", "rare"),
        allowNull: true,
      },
      project_type: {
        type: Sequelize.ENUM("international", "domestic", "both"),
        allowNull: true,
      },
      annual_projects: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      hiring_tiers: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      linkedin_profile: {
        type: Sequelize.STRING(500),
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
    await queryInterface.dropTable("studios");
  },
};
