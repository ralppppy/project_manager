"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Files", {
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
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      uploader_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_type: {
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

    await queryInterface.addIndex("EP_Files", ["organization_id"], {
      name: "file_organization_id_index",
    });
    await queryInterface.addIndex("EP_Files", ["project_id"], {
      name: "file_project_id_index",
    });
    await queryInterface.addIndex("EP_Files", ["module_id"], {
      name: "file_module_id_index",
    });
    await queryInterface.addIndex("EP_Files", ["task_id"], {
      name: "file_task_id_index",
    });
    await queryInterface.addIndex("EP_Files", ["client_id"], {
      name: "file_client_id_index",
    });
    await queryInterface.addIndex("EP_Files", ["comment_id"], {
      name: "file_comment_id_index",
    });
    await queryInterface.addIndex("EP_Files", ["uploader_id"], {
      name: "file_uploader_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Files");
  },
};
