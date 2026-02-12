"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Suratdomisili extends Model {
        static associate(models) {
            Suratdomisili.hasOne(models.Permohonan, {
                foreignKey: "Suratdomisiliid",
                as: "Permohonan",
            });
        }
    }
    Suratdomisili.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Suratdomisili",
            tableName: "suratdomisilies",
            timestamps: true,
        },
    );
    return Suratdomisili;
};
