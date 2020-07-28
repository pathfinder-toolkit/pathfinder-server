module.exports = (sequelize, DataTypes) => {
    const CommentReport = sequelize.define("CommentReport", {
        idReport: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        reportedBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },  {
        tableName: 'CommentReports'
    }
    );
  
    return CommentReport;
};