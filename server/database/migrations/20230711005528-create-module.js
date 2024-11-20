"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Modules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      client_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      project_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      organization_id: { allowNull: false, type: Sequelize.INTEGER },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
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
    await queryInterface.addConstraint("EP_Modules", {
      fields: ["name", "project_id"],
      type: "unique",
      name: "module_unique_name_project_id",
    });
    await queryInterface.addIndex("EP_Modules", ["client_id"], {
      name: "module_client_id_index",
    });
    await queryInterface.addIndex("EP_Modules", ["project_id"], {
      name: "module_project_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Modules");
  },
};
