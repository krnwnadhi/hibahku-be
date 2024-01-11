"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class IzinOperasional extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            IzinOperasional.hasOne(models.Permohonan, {
                foreignKey: "izinoperasionalid",
                as: "Permohonan",
            });
        }
    }
    IzinOperasional.init(
        {
            namafile: DataTypes.STRING,
            size: DataTypes.STRING,
            path: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "IzinOperasional",
            tableName: "izinoperasional",
            timestamps: true,
        }
    );
    return IzinOperasional;
};
