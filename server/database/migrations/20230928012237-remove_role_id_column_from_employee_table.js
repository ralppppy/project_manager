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
    await queryInterface.removeIndex("EP_Employees", "employee_role_id_index");
    await queryInterface.removeColumn("EP_Employees", "role_id");
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.addIndex("EP_Employees", ["role_id"], {
      name: "employee_role_id_index",
    });

    await queryInterface.addColumn("EP_Employees", "role_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: "dept_id",
    });
  },
};
