"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("EP_Users", "user_type_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: "organization_id",
    });

    await queryInterface.addIndex("EP_Users", ["user_type_id"], {
      name: "user_type_id_index",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("EP_Users", "user_type_id");
  },
};
