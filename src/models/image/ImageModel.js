module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("Image", {
        idImage: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        authorSub: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'Images'
    }
    );
    
    return Image;
};