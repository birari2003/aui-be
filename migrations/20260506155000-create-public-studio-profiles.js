"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("public_studio_profiles", {
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
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      banner_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      projects_completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      artists_hired: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      years_active: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      awards_won: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      what_we_do: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      why_work_with_us: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      studio_reel_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      extra_videos: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      projects: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      clients: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      social_links: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("public_studio_profiles");
  },
};
