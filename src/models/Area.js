const {  DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize')

const Area = sequelize.define('Area', {
    idArea: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    areaName: {
        type: DataTypes.STRING,
        allowNull: false
        }
    },  {
    tableName: 'Areas'
    }
);

module.exports = Area;