module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        idComment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        commentText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        commentAuthor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        commentAuthorSub: {
            type: DataTypes.STRING,
            allowNull: false
        },
        commentSentiment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        commentSecondarySubject: {
            type: DataTypes.STRING,
            allowNull: true
        },
        commentAnonymity: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },  {
        tableName: 'Comments'
    }
    );
  
    return Comment;
};