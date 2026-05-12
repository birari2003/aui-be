'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const targetTable = 'nexus_opportunities';
    const legacyTable = 'NexusOpportunities';

    const rawTables = await queryInterface.showAllTables();
    const tables = rawTables.map((t) => {
      if (typeof t === 'string') return t;
      return t.tableName || t.name;
    });

    const hasTarget = tables.includes(targetTable);
    const hasLegacy = tables.includes(legacyTable);

    if (!hasTarget && hasLegacy) {
      await queryInterface.renameTable(legacyTable, targetTable);
    }

    if (!hasTarget && !hasLegacy) {
      await queryInterface.createTable(targetTable, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
        },
        date: {
          type: Sequelize.STRING,
        },
        limit: {
          type: Sequelize.STRING,
        },
        tag: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.TEXT,
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
      return;
    }

    const columns = await queryInterface.describeTable(targetTable);

    if (columns.createdAt && !columns.created_at) {
      await queryInterface.renameColumn(targetTable, 'createdAt', 'created_at');
    }

    if (columns.updatedAt && !columns.updated_at) {
      await queryInterface.renameColumn(targetTable, 'updatedAt', 'updated_at');
    }
  },

  async down(queryInterface) {
    const targetTable = 'nexus_opportunities';
    const legacyTable = 'NexusOpportunities';

    const rawTables = await queryInterface.showAllTables();
    const tables = rawTables.map((t) => {
      if (typeof t === 'string') return t;
      return t.tableName || t.name;
    });

    const hasTarget = tables.includes(targetTable);
    const hasLegacy = tables.includes(legacyTable);

    if (!hasTarget || hasLegacy) {
      return;
    }

    const columns = await queryInterface.describeTable(targetTable);

    if (columns.created_at && !columns.createdAt) {
      await queryInterface.renameColumn(targetTable, 'created_at', 'createdAt');
    }

    if (columns.updated_at && !columns.updatedAt) {
      await queryInterface.renameColumn(targetTable, 'updated_at', 'updatedAt');
    }

    await queryInterface.renameTable(targetTable, legacyTable);
  },
};
