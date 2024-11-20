"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Clients", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      client_id_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addConstraint("EP_Clients", {
      fields: ["name", "organization_id"],
      type: "unique",
      name: "client_unique_name_organization_id",
    });
    await queryInterface.addConstraint("EP_Clients", {
      fields: ["organization_id", "client_id_text"],
      type: "unique",
      name: "client_unique_organization_id_client_id_text",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Clients");
  },
};
