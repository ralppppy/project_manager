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

    return Promise.all([
      queryInterface.removeColumn("EP_Users", "user_type_id"),
      queryInterface.removeColumn("EP_Users", "dept_id"),
      queryInterface.removeColumn("EP_Users", "role_id"),
      queryInterface.removeColumn("EP_Users", "phone_number"),
      queryInterface.removeColumn("EP_Users", "country"),
      queryInterface.removeColumn("EP_Users", "zip_code"),
      queryInterface.removeColumn("EP_Users", "street_nr"),
      queryInterface.removeColumn("EP_Users", "city"),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return Promise.all([
      queryInterface.addColumn("EP_Users", "user_type_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "organization_id",
      }),
      queryInterface.addColumn("EP_Users", "dept_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "user_type_id",
      }),
      queryInterface.addColumn("EP_Users", "role_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "dept_id",
      }),
      queryInterface.addColumn("EP_Users", "phone_number", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "role_id",
      }),
      queryInterface.addColumn("EP_Users", "country", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "phone_number",
      }),
      queryInterface.addColumn("EP_Users", "zip_code", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "country",
      }),
      queryInterface.addColumn("EP_Users", "street_nr", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "zip_code",
      }),
      queryInterface.addColumn("EP_Users", "city", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "street_nr",
      }),
    ]);
  },
};
