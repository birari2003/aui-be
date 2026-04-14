"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("special_requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "professionals", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      professional_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      professional_public_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      institute_public_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mentorship_time: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "contacted", "closed", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      response_message: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex("special_requests", ["professional_id"]);
    await queryInterface.addIndex("special_requests", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("special_requests");
  },
};
