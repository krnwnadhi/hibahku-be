"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class StatusProgres extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            StatusProgres.belongsTo(models.User, {
                foreignKey: "userid",
                as: "User",
            });
            StatusProgres.belongsTo(models.Proses, {
                foreignKey: "prosesid",
                as: "Proses",
            });
        }
    }
    StatusProgres.init(
        {
            userid: DataTypes.INTEGER,
            prosesid: DataTypes.INTEGER,
            keterangan: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Statusprogres",
            tableName: "statusprogress",
            timestamps: true,
        }
    );
    return StatusProgres;
};
