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

    await queryInterface.addColumn("EP_Departments", "color", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "dept_name",
    });

    await queryInterface.addColumn("EP_Departments", "sort", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: "color",
    });

    await queryInterface.addColumn("EP_Departments", "active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: "sort",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("EP_Departments", "color");
    await queryInterface.removeColumn("EP_Departments", "sort");
    await queryInterface.removeColumn("EP_Departments", "active");
  },
};
