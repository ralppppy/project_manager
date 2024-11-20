"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_ProjectVersions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      organization_id: { type: Sequelize.INTEGER, allowNull: false },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("EP_ProjectVersions", ["organization_id"], {
      name: "project_version_organization_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_ProjectVersions");
  },
};
