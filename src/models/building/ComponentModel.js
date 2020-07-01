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
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },  {
        tableName: 'Components'
    }
    );
  
    return Component;
};