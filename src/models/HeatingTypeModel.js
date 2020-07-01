module.exports = (sequelize, DataTypes) => {
    const HeatingType = sequelize.define("HeatingType", {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'HeatingTypes'
    }
    );
  
    return HeatingType;
};