module.exports = (sequelize, DataTypes) => {
    const ComponentValue = sequelize.define("ComponentValue", {
        valueString: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        valueDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        valueInt: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        valueDouble: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: null
        },
        valueBoolean: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: null
        },
        valueText: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        }
    },  {
        tableName: 'ComponentValues'
    }
    );
  
    return ComponentValue;
};