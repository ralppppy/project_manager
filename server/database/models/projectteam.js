"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectTeam.project = ProjectTeam.belongsTo(models.EP_Project, {
        as: "project",
        foreignKey: "project_id",
      });
      ProjectTeam.client = ProjectTeam.belongsTo(models.EP_Client, {
        as: "client",
        foreignKey: "client_id",
      });
      ProjectTeam.organization = ProjectTeam.belongsTo(models.EP_Organization, {
        as: "organization",
        foreignKey: "organization_id",
      });
      ProjectTeam.user = ProjectTeam.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "user_id",
      });
      ProjectTeam.project_role = ProjectTeam.belongsTo(models.EP_ProjectRole, {
        as: "project_role",
        foreignKey: "project_role_id",
      });
      ProjectTeam.module_team = ProjectTeam.hasOne(models.EP_ModuleTeam, {
        as: "module_team",
        foreignKey: "project_id",
      });
    }
  }
  ProjectTeam.init(
    {
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      client_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      project_role_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_ProjectTeam",
    }
  );
  return ProjectTeam;
};
