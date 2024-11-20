"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_ProjectTeams", {
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
      client_id: { type: Sequelize.INTEGER, allowNull: false },

      project_role_id: { type: Sequelize.INTEGER, allowNull: false },

      user_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("EP_ProjectTeams", ["organization_id"], {
      name: "project_team_organization_id_index",
    });
    await queryInterface.addIndex("EP_ProjectTeams", ["project_id"], {
      name: "project_team_project_id_index",
    });
    await queryInterface.addIndex("EP_ProjectTeams", ["client_id"], {
      name: "project_team_client_id_index",
    });
    await queryInterface.addIndex("EP_ProjectTeams", ["user_id"], {
      name: "project_team_user_id_index",
    });
    await queryInterface.addIndex("EP_ProjectTeams", ["project_role_id"], {
      name: "project_team_project_role_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_ProjectTeams");
  },
};
