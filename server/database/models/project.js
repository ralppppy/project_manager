"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.team = Project.hasMany(models.EP_ProjectTeam, {
        as: "team",
        foreignKey: "project_id",
      });
      Project.teams_users = Project.hasMany(models.EP_ProjectTeam, {
        as: "teams_users",
        foreignKey: "project_id",
      });
      Project.module_team = Project.hasMany(models.EP_ModuleTeam, {
        as: "module_team",
        foreignKey: "project_id",
      });

      Project.versions = Project.hasMany(models.EP_ProjectVersion, {
        as: "versions",
        foreignKey: "project_id",
      });
      Project.client = Project.belongsTo(models.EP_Client, {
        as: "client",
        foreignKey: "client_id",
      });
      Project.modules = Project.hasMany(models.EP_Module, {
        as: "modules",
        foreignKey: "project_id",
      });
      Project.children = Project.hasMany(models.EP_Module, {
        as: "children",
        foreignKey: "project_id",
      });

      Project.tasks = Project.hasMany(models.EP_Task, {
        as: "tasks",
        foreignKey: "project_id",
      });
    }
  }
  Project.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      project_id_text: { type: DataTypes.STRING, allowNull: false },
      client_id: { type: DataTypes.INTEGER, allowNull: false },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      sort: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "EP_Project",
    }
  );
  return Project;
};
