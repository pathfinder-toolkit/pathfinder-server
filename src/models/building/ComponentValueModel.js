module.exports = (sequelize, DataTypes) => {
    const ComponentValue = sequelize.define("ComponentValue", {
        valueString: {
            type: DataTypes.STRING,
            allowNull: true
        },
        valueDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        valueInt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        valueDouble: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        valueBoolean: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    },  {
        tableName: 'ComponentValues'
    }
    );
  
    return ComponentValue;
};