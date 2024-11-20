"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("EP_Users", "dept_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: "user_type_id",
    });

    await queryInterface.addIndex("EP_Users", ["dept_id"], {
      name: "user_dept_id_index",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("EP_Users", "dept_id");
  },
};
