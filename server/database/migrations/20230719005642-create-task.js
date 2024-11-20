"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_title: {
        type: Sequelize.STRING,
        allowNull: false,
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
      task_priority_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      connected_to_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      time_estimate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      hours_worked: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      instruction: {
        type: Sequelize.TEXT("LONG"),
        allowNull: true,
      },
      deadline: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex("EP_Tasks", ["module_id"], {
      name: "task_module_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["task_title"], {
      name: "task_task_title_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["client_id"], {
      name: "task_client_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["project_id"], {
      name: "task_project_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["connected_to_id"], {
      name: "task_connected_to_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["creator_id"], {
      name: "task_creator_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["organization_id"], {
      name: "task_organization_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["task_priority_id"], {
      name: "task_task_priority_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["task_status_id"], {
      name: "task_task_status_id_index",
    });
    await queryInterface.addIndex("EP_Tasks", ["task_type_id"], {
      name: "task_task_type_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Tasks");
  },
};
