"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectVersion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectVersion.project = ProjectVersion.belongsTo(models.EP_Project, {
        as: "project",
        foreignKey: "project_id",
      });
    }
  }
  ProjectVersion.init(
    {
      project_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_ProjectVersion",
    }
  );
  return ProjectVersion;
};
