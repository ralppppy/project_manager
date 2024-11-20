"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_TaskCompletionSettings", {
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
      task_status_id: {
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
    await queryInterface.addIndex(
      "EP_TaskCompletionSettings",
      ["organization_id"],
      {
        name: "task_completion_settings_organization_id_index",
      }
    );

    await queryInterface.addIndex(
      "EP_TaskCompletionSettings",
      ["task_status_id"],
      {
        name: "task_completion_settings_task_status_id_index",
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_TaskCompletionSettings");
  },
};
