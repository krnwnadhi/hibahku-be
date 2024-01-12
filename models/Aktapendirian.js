"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Aktapendirian extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Aktapendirian.hasOne(models.Permohonan, {
                foreignKey: "aktapendirianid",
                as: "Permohonan",
            });
        }
    }
    Aktapendirian.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Aktapendirian",
            tableName: "aktapendirians",
            timestamps: true,
        }
    );
    return Aktapendirian;
};
