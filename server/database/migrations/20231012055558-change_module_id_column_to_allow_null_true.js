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

    await queryInterface.changeColumn("EP_Tasks", "module_id", {
      type: Sequelize.INTEGER, // Use the appropriate data type
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("EP_Tasks", "module_id", {
      type: Sequelize.INTEGER, // Use the appropriate data type
      allowNull: false, // Change this back to false
    });
  },
};
