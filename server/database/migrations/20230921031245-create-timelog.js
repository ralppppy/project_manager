"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Timelogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      hours_worked: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.addIndex("EP_Timelogs", ["organization_id"], {
      name: "timelog_organization_id_index",
    });
    await queryInterface.addIndex("EP_Timelogs", ["client_id"], {
      name: "timelog_client_id_index",
    });
    await queryInterface.addIndex("EP_Timelogs", ["project_id"], {
      name: "timelog_project_id_index",
    });

    await queryInterface.addIndex("EP_Timelogs", ["module_id"], {
      name: "timelog_module_id_index",
    });

    await queryInterface.addIndex("EP_Timelogs", ["task_id"], {
      name: "timelog_task_id_index",
    });
    await queryInterface.addIndex("EP_Timelogs", ["user_id"], {
      name: "timelog_user_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Timelogs");
  },
};
