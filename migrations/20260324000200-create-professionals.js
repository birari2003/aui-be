"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("professionals", {
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
      full_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      experience_years: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      level: {
        type: Sequelize.ENUM("fresher", "junior", "mid", "senior"),
        allowNull: false,
      },
      primary_skill: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      position: {
        type: Sequelize.ENUM("artist", "lead", "supervisor", "director", "other"),
        allowNull: false,
      },
      production_type: {
        type: Sequelize.ENUM("film", "tv", "web", "ads"),
        allowNull: false,
      },
      responsibility_scope: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      showreel_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      portfolio_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      availability: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      is_mentor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mentor_availability: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mentor_specializations: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      confidence_score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex("professionals", ["primary_skill"]);
    await queryInterface.addIndex("professionals", ["position"]);
    await queryInterface.addIndex("professionals", ["level"]);
    await queryInterface.addIndex("professionals", ["verification_status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("professionals");
  },
};
