"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Organization.team = Organization.hasMany(models.EP_ProjectTeam, {
        as: "team",
        foreignKey: "organization_id",
      });
    }
  }

  Organization.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: false },
      phone_number: { type: DataTypes.STRING, allowNull: false },
      organization_color: { type: DataTypes.STRING, allowNull: false },
      logo_path: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: false },
      website: { type: DataTypes.STRING, allowNull: true },
      owner_id: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_Organization",
    }
  );
  return Organization;
};
