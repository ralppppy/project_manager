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
    await queryInterface.addColumn("EP_ClientUsers", "client_id", {
      type: Sequelize.INTEGER,
      after: "user_id",
      allowNull: true,
    });

    await queryInterface.addIndex("EP_ClientUsers", ["client_id"], {
      name: "client_user_client_id_index",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("EP_ClientUsers", "client_id");
  },
};
