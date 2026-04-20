"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Suratrekomkemenag extends Model {
        static associate(models) {
            Suratrekomkemenag.hasOne(models.Permohonan, {
                foreignKey: "Suratrekomkemenagid",
                as: "Permohonan",
            });
        }
    }
    Suratrekomkemenag.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Suratrekomkemenag",
            tableName: "Suratrekomkemenags", //TODO -> suratrekomkemenags
            timestamps: true,
        },
    );
    return Suratrekomkemenag;
};
