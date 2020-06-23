const {  DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');


const Material = sequelize.define('Material', {
    value: {
        type: DataTypes.STRING,
        allowNull: false
        }
    },  {
    tableName: 'Materials'
    }
);

module.exports = Material;