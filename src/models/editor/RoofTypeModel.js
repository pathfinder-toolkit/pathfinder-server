module.exports = (sequelize, DataTypes) => {
    const RoofType = sequelize.define("RoofType", {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'RoofTypes'
    }
    );
  
    return RoofType;
};