"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ModuleTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ModuleTeam.module = ModuleTeam.belongsTo(models.EP_Module, {
        as: "module",
        foreignKey: "module_id",
      });
      ModuleTeam.project_team = ModuleTeam.belongsTo(models.EP_ProjectTeam, {
        as: "project_team",
        foreignKey: "project_team_id",
      });
      ModuleTeam.user = ModuleTeam.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "user_id",
      });
      ModuleTeam.project = ModuleTeam.belongsTo(models.EP_Project, {
        as: "project",
        foreignKey: "project_id",
      });
      ModuleTeam.project_role = ModuleTeam.belongsTo(models.EP_ProjectRole, {
        as: "project_role",
        foreignKey: "project_role_id",
      });
    }
  }
  ModuleTeam.init(
    {
      project_team_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      client_id: { type: DataTypes.INTEGER, allowNull: false },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      project_role_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_ModuleTeam",
    }
  );
  return ModuleTeam;
};
