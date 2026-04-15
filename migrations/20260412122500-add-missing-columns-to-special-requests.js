"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("special_requests");

    if (!tableInfo.sender_role) {
      await queryInterface.addColumn("special_requests", "sender_role", {
        type: Sequelize.ENUM("professional", "institute", "admin"),
        allowNull: false,
        defaultValue: "professional",
      });
    }

    if (!tableInfo.institute_id) {
      await queryInterface.addColumn("special_requests", "institute_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "institutes", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Optionally remove columns.
  },
};
