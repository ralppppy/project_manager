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
    await queryInterface.addColumn("EP_ProjectRoles", "color", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "organization_id",
    });

    await queryInterface.addColumn("EP_ProjectRoles", "sort", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0,
      after: "color",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("EP_ProjectRoles", "color");
    await queryInterface.removeColumn("EP_ProjectRoles", "sort");

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
