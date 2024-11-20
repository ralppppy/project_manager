"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_TasksTeams", {
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
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_id: {
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

    await queryInterface.addIndex("EP_TasksTeams", ["organization_id"], {
      name: "tasks_team_organization_id_index",
    });
    await queryInterface.addIndex("EP_TasksTeams", ["project_id"], {
      name: "tasks_team_project_id_index",
    });
    await queryInterface.addIndex("EP_TasksTeams", ["module_id"], {
      name: "tasks_team_module_id_index",
    });
    await queryInterface.addIndex("EP_TasksTeams", ["task_id"], {
      name: "tasks_team_task_id_index",
    });
    await queryInterface.addIndex("EP_TasksTeams", ["client_id"], {
      name: "tasks_team_client_id_index",
    });
    await queryInterface.addIndex("EP_TasksTeams", ["user_id"], {
      name: "tasks_team_user_id_index",
    });
    await queryInterface.addIndex("EP_TasksTeams", ["project_role_id"], {
      name: "tasks_team_project_role_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_TasksTeams");
  },
};
