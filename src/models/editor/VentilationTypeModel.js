module.exports = (sequelize, DataTypes) => {
    const VentilationType = sequelize.define("VentilationType", {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'VentilationTypes'
    }
    );
  
    return VentilationType;
};