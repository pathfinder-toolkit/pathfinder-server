module.exports = (sequelize, DataTypes) => {
    const Area = sequelize.define("Area", {
        idArea: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        areaName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'Areas'
    }
    );
  
    return Area;
};