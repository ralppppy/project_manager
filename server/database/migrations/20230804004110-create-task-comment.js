"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_TaskComments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment: { type: Sequelize.TEXT("LONG"), allowNull: false },
      commenter_id: { type: Sequelize.INTEGER, allowNull: false },
      task_id: { type: Sequelize.INTEGER, allowNull: false },
      reply_to_id: { type: Sequelize.INTEGER, allowNull: true },
      organization_id: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("EP_TaskComments", ["organization_id"], {
      name: "tasks_comment_organization_id_index",
    });
    await queryInterface.addIndex("EP_TaskComments", ["task_id"], {
      name: "tasks_comment_task_id_index",
    });
    await queryInterface.addIndex("EP_TaskComments", ["reply_to_id"], {
      name: "tasks_comment_reply_to_id_index",
    });
    await queryInterface.addIndex("EP_TaskComments", ["commenter_id"], {
      name: "tasks_comment_commenter_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_TaskComments");
  },
};
