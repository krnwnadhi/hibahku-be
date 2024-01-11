"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Ktp extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Ktp.hasOne(models.Permohonan, {
                foreignKey: "ktpid",
                as: "Permohonan",
            });
        }
    }
    Ktp.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Ktp",
            tableName: "ktp",
            timestamps: true,
        }
    );
    return Ktp;
};
