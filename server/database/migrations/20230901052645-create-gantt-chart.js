"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_GanttCharts", {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("EP_GanttCharts", ["organization_id"], {
      name: "gantt_chart_organization_id_index",
    });
    await queryInterface.addIndex("EP_GanttCharts", ["client_id"], {
      name: "gantt_chart_client_id_index",
    });
    await queryInterface.addIndex("EP_GanttCharts", ["project_id"], {
      name: "gantt_chart_project_id_index",
    });

    await queryInterface.addIndex("EP_GanttCharts", ["module_id"], {
      name: "gantt_chart_module_id_index",
    });

    await queryInterface.addIndex("EP_GanttCharts", ["task_id"], {
      name: "gantt_chart_task_id_index",
    });
    await queryInterface.addIndex("EP_GanttCharts", ["user_id"], {
      name: "gantt_chart_user_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_GanttCharts");
  },
};
