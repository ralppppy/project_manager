"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "EP_ModuleTeams", // table name
        "project_id", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          after: "module_id",
        }
      ),
      queryInterface.addColumn("EP_ModuleTeams", "client_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "module_id",
      }),
      queryInterface.addColumn("EP_ModuleTeams", "project_role_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "module_id",
      }),
      queryInterface.addColumn("EP_ModuleTeams", "organization_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "module_id",
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("EP_ModuleTeams", "project_id"),
      queryInterface.removeColumn("EP_ModuleTeams", "client_id"),
      queryInterface.removeColumn("EP_ModuleTeams", "project_role_id"),
      queryInterface.removeColumn("EP_ModuleTeams", "organization_id"),
    ]);
  },
};
