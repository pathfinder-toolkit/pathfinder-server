module.exports = (sequelize, DataTypes) => {
    const AreaOption = sequelize.define("AreaOption", {
        idOption: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        option: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'AreaOptions'
    }
    );
    
    return AreaOption;
};
