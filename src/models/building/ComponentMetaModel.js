module.exports = (sequelize, DataTypes) => {
    const ComponentMeta = sequelize.define("ComponentMeta", {
        idMeta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        componentDescription: {
            type: DataTypes.STRING,
            allowNull: false
        },
        componentName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hasSuggestions: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },  {
        tableName: 'ComponentMetas'
    }
    );
  
    return ComponentMeta;
};