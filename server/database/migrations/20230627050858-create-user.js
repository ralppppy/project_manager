"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EP_Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.TEXT, allowNull: true },
      organization_id: { type: Sequelize.INTEGER, allowNull: true },

      role_id: { type: Sequelize.INTEGER, allowNull: false },
      phone_number: { type: Sequelize.STRING, allowNull: true },
      country: { type: Sequelize.STRING, allowNull: true },
      zip_code: { type: Sequelize.STRING, allowNull: true },
      street_nr: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false },
      verification_token: { type: Sequelize.TEXT, allowNull: true },
      reset_password_token: { type: Sequelize.TEXT, allowNull: true },
      sort: { type: Sequelize.TEXT, allowNull: false },
      active_security: { type: Sequelize.TEXT, allowNull: false },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addConstraint("EP_Users", {
      fields: ["email", "organization_id"],
      type: "unique",
      name: "client_unique_email_organization_id_",
    });

    await queryInterface.addIndex("EP_Users", ["role_id"], {
      name: "user_role_id_index",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("EP_Users", "organization_id_index");
    await queryInterface.removeIndex("EP_Users", "role_id_index");
    await queryInterface.dropTable("EP_Users");
  },
};
