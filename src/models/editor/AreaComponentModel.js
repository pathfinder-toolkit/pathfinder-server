module.exports = (sequelize, DataTypes) => {
    const AreaComponent = sequelize.define("AreaComponent", {
        idAreaComponent: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        identifier: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'AreaComponents'
    }
    );
  
    return AreaComponent;
};
