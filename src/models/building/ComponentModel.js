module.exports = (sequelize, DataTypes) => {
    const Component = sequelize.define("Component", {
        idComponent: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        isCurrent: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        usageStartYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: new Date().getFullYear()
        }
    },  {
        tableName: 'Components'
    }
    );
  
    return Component;
};