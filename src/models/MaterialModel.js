module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define("Material", {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'Materials'
    }
    );
  
    return Material;
};