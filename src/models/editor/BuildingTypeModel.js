module.exports = (sequelize, DataTypes) => {
    const BuildingType = sequelize.define("BuildingType", {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'BuildingTypes'
    }
    );
  
    return BuildingType;
};