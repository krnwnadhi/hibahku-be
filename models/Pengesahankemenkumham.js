"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Pengesahankemenkumham extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Pengesahankemenkumham.hasOne(models.Permohonan, {
                foreignKey: "pengesahankemenkumhamid",
                as: "Permohonan",
            });
        }
    }
    Pengesahankemenkumham.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "pengesahankemenkumham",
            tableName: "pengesahankemenkumham",
            timestamps: true,
        }
    );
    return Pengesahankemenkumham;
};
