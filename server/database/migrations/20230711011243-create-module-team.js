"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_ModuleTeams", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_team_id: { type: Sequelize.INTEGER, allowNull: false },

      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    // await queryInterface.addIndex("EP_ModuleTeams", ["organization_id"], {
    //   name: "module_team_organization_id_index",
    // });
    await queryInterface.addIndex("EP_ModuleTeams", ["project_team_id"], {
      name: "module_team_project_id_index",
    });
    await queryInterface.addIndex("EP_ModuleTeams", ["module_id"], {
      name: "module_team_module_id_index",
    });
    await queryInterface.addIndex("EP_ModuleTeams", ["user_id"], {
      name: "module_team_user_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_ModuleTeams");
  },
};
