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

    await queryInterface.addColumn("EP_UserTypes", "color", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "name",
    });

    await queryInterface.addColumn("EP_UserTypes", "organization_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: "color",
    });

    await queryInterface.addColumn("EP_UserTypes", "sort", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: "organization_id",
    });

    await queryInterface.addColumn("EP_UserTypes", "active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: "sort",
    });

    await queryInterface.addIndex("EP_UserTypes", ["organization_id"], {
      name: "user_types_organization_id_index",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("EP_UserTypes", "color");
    await queryInterface.removeColumn("EP_UserTypes", "organization_id");
    await queryInterface.removeColumn("EP_UserTypes", "sort");
    await queryInterface.removeColumn("EP_UserTypes", "active");
  },
};
