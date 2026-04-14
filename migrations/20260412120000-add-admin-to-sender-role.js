"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("special_requests", "sender_role", {
      type: Sequelize.ENUM("professional", "institute", "admin"),
      allowNull: false,
      defaultValue: "professional",
    });
  },

  async down(queryInterface, Sequelize) {
    // Note: This might fail if any 'admin' rows exist. Cleanup would be needed first.
    await queryInterface.changeColumn("special_requests", "sender_role", {
      type: Sequelize.ENUM("professional", "institute"),
      allowNull: false,
      defaultValue: "professional",
    });
  },
};
