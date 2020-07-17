module.exports = (sequelize, DataTypes) => {
    const Suggestion = sequelize.define("Suggestion", {
        idSuggestion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        suggestionText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        suggestionSecondarySubject: {
            type: DataTypes.STRING,
            allowNull: true
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },  {
        tableName: 'Suggestions'
    }
    );
  
    return Suggestion;
};