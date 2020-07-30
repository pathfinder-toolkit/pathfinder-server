module.exports = (sequelize, DataTypes) => {
    const Building = sequelize.define("Building", {
        idBuilding: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        buildingAuthorSub: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        publicStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },  {
        tableName: 'Buildings'
    }
    );
  
    return Building;
};