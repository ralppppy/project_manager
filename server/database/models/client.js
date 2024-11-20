"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Client.projects = Client.hasMany(models.EP_Project, {
        as: "projects",
        foreignKey: "client_id",
      });
      Client.children = Client.hasMany(models.EP_Project, {
        as: "children",
        foreignKey: "client_id",
      });
      Client.teams_users = Client.hasMany(models.EP_ProjectTeam, {
        as: "teams_users",
        foreignKey: "client_id",
      });
      Client.team = Client.hasMany(models.EP_ProjectTeam, {
        as: "team",
        foreignKey: "client_id",
      });

      Client.tasks = Client.hasMany(models.EP_Task, {
        as: "tasks",
        foreignKey: "client_id",
      });
    }
  }
  Client.init(
    {
      client_id_text: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: "EP_Client",
    }
  );
  return Client;
};
