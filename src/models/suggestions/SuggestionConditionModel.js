module.exports = (sequelize, DataTypes) => {
    const SuggestionCondition = sequelize.define("SuggestionCondition", {
        idCondition: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        condition: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        areas: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'SuggestionConditions'
    }
    );
  
    return SuggestionCondition;
};
