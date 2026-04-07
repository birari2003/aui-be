'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      email: 'gauravbirari07@gmail.com',
      role: 'admin',
      status: 'approved',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', { email: 'gauravbirari07@gmail.com' }, {});
  }
};
