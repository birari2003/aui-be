"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("collaboration_requests", {
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
      institute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "institutes", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      sender_role: {
        type: Sequelize.ENUM("professional", "institute"),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      proposed_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected", "cancelled"),
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

    await queryInterface.addIndex("collaboration_requests", ["professional_id"]);
    await queryInterface.addIndex("collaboration_requests", ["institute_id"]);
    await queryInterface.addIndex("collaboration_requests", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("collaboration_requests");
  },
};
