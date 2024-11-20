"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Holiday extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Holiday.holiday_type = Holiday.belongsTo(models.EP_HolidayType, {
        as: "holiday_type",
        foreignKey: "holiday_type_id",
      });
    }
  }
  Holiday.init(
    {
      instruction: { type: DataTypes.STRING, allowNull: false },
      holiday_id_text: { type: DataTypes.STRING, allowNull: false },
      holiday_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_Holidays",
    }
  );
  return Holiday;
};
