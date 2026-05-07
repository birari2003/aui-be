"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("public_professional_profiles", {
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
      aui_insight: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      experience_timeline: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      showreel_type: {
        type: Sequelize.ENUM("youtube", "direct"),
        allowNull: true,
        defaultValue: "youtube",
      },
      showreel_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      showreel_title: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      showreel_duration: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      work_ledger: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
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
    await queryInterface.dropTable("public_professional_profiles");
  },
};
