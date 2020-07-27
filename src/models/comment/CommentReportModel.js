module.exports = (sequelize, DataTypes) => {
    const CommentReport = sequelize.define("CommentReport", {
        idReport: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        reportedBy: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },  {
        tableName: 'CommentReports'
    }
    );
  
    return CommentReport;
};