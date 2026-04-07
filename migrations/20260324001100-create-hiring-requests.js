"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hiring_requests", {
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
      role_needed: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      number_of_artists: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      project_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
    await queryInterface.dropTable("hiring_requests");
  },
};
