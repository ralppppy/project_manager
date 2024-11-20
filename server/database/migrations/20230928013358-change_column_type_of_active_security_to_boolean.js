"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("EP_Users", "active_security", {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.changeColumn("EP_Users", "sort", {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("EP_Users", "active_security", {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("EP_Users", "sort", {
      type: Sequelize.STRING,
    });
  },
};
