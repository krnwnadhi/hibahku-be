"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Norekening extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Norekening.hasOne(models.Permohonan, {
                foreignKey: "norekeningid",
                as: "Permohonan",
            });
        }
    }
    Norekening.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Norekening",
            tableName: "norekenings",
            timestamps: true,
        },
    );
    return Norekening;
};
