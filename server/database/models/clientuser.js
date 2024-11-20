"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClientUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClientUser.user = ClientUser.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "user_id",
      });
    }
  }
  ClientUser.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      client_id: { type: DataTypes.INTEGER, allowNull: false },
      phone_number: { type: DataTypes.STRING, allowNull: true },
      country: { type: DataTypes.STRING, allowNull: true },
      zip_code: { type: DataTypes.STRING, allowNull: true },
      street_nr: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "EP_ClientUser",
    }
  );
  return ClientUser;
};
