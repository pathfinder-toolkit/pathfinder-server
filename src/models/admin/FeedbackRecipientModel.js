module.exports = (sequelize, DataTypes) => {
    const FeedbackRecipient = sequelize.define("FeedbackRecipient", {
        idFeedbackRecipient: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        eMail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        setBy: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        }
    },  {
        tableName: 'FeedbackRecipients'
    }
    );
  
    return FeedbackRecipient;
};