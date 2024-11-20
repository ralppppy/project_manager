"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Holidays", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      holiday_id_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      holiday_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      organization_id: { type: Sequelize.INTEGER, allowNull: false },

      instruction: {
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

    await queryInterface.addConstraint("EP_Holidays", {
      fields: ["organization_id", "holiday_id_text"],
      type: "unique",
      name: "holiday_unique_organization_id_holiday_id_text",
    });
    await queryInterface.addIndex("EP_Holidays", ["organization_id"], {
      name: "holiday_organization_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Holidays");
  },
};
