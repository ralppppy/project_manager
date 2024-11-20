"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_id_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      organization_id: { type: Sequelize.INTEGER, allowNull: false },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sort: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("EP_Projects", {
      fields: ["name", "organization_id"],
      type: "unique",
      name: "project_unique_name_organization_id",
    });
    await queryInterface.addConstraint("EP_Projects", {
      fields: ["organization_id", "project_id_text"],
      type: "unique",
      name: "project_unique_organization_id_client_id_text",
    });

    await queryInterface.addIndex("EP_Projects", ["client_id"], {
      name: "project_client_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Projects");
  },
};
