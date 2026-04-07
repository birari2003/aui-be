"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      institute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "institutes", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "professionals", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      skill_requested: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      booking_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time_slot: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      program_type: {
        type: Sequelize.ENUM("workshop", "mentorship", "review"),
        allowNull: false,
      },
      topic: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      student_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "completed"),
        allowNull: false,
        defaultValue: "pending",
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

    await queryInterface.addIndex("bookings", ["status"]);
    await queryInterface.addIndex("bookings", ["institute_id"]);
    await queryInterface.addIndex("bookings", ["professional_id"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bookings");
  },
};
