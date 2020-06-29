module.exports = (sequelize, DataTypes) => {
    const Component = sequelize.define("Component", {
        idComponent: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        componentName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hasSuggestions: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isCurrent: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        usageStartYear: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        componentValueType: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'Components'
    }
    );
  
    return Component;
};