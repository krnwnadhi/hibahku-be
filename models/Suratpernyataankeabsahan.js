"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Suratpernyataankeabsahan extends Model {
        static associate(models) {
            Suratpernyataankeabsahan.hasOne(models.Permohonan, {
                foreignKey: "Suratpernyataankeabsahanid",
                as: "Permohonan",
            });
        }
    }
    Suratpernyataankeabsahan.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Suratpernyataankeabsahan",
            tableName: "suratpernyataankeabsahans",
            timestamps: true,
        },
    );
    return Suratpernyataankeabsahan;
};
