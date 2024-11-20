"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Employees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dept_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      street_nr: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex("EP_Employees", ["user_id"], {
      name: "employee_user_id_index",
    });

    await queryInterface.addIndex("EP_Employees", ["role_id"], {
      name: "employee_role_id_index",
    });

    await queryInterface.addIndex("EP_Employees", ["user_type_id"], {
      name: "employee_user_type_id_index",
    });
    await queryInterface.addIndex("EP_Employees", ["dept_id"], {
      name: "employee_dept_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EP_Employees");
  },
};
