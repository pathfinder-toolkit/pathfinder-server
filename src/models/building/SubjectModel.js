module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define("Subject", {
        idSubject: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        subjectText: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },  {
        tableName: 'Subjects'
    }
    );
  
    return Subject;
};