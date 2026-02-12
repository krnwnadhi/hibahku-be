"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Suratpernyataantidakhibah extends Model {
        static associate(models) {
            Suratpernyataantidakhibah.hasOne(models.Permohonan, {
                foreignKey: "Suratpernyataantidakhibahid",
                as: "Permohonan",
            });
        }
    }
    Suratpernyataantidakhibah.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Suratpernyataantidakhibah",
            tableName: "suratpernyataantidakhibahs",
            timestamps: true,
        },
    );
    return Suratpernyataantidakhibah;
};
