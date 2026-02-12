"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Npwp extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Npwp.hasOne(models.Permohonan, {
                foreignKey: "npwpid",
                as: "Permohonan",
            });
        }
    }
    Npwp.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Npwp",
            tableName: "npwps",
            timestamps: true,
        },
    );
    return Npwp;
};
