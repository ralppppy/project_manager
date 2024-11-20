"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_UserTypeMenuAccesses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      menu_key_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addConstraint("EP_UserTypeMenuAccesses", {
      fields: ["organization_id", "user_type_id", "menu_key_code"],
      type: "unique",
      name: "user_type_menu_access_unique_name_organization_id",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_UserTypeMenuAccesses");
  },
};
