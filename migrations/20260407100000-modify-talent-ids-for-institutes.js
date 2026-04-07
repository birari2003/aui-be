"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add institute_id to talent_ids
    await queryInterface.addColumn("talent_ids", "institute_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: { model: "institutes", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Make professional_id nullable in talent_ids
    await queryInterface.changeColumn("talent_ids", "professional_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("talent_ids", "institute_id");
    
    // Revert professional_id to non-nullable (careful if nulls exist)
    await queryInterface.changeColumn("talent_ids", "professional_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    });
  },
};
