module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        idCategory: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },  {
        tableName: 'Categories'
    }
    );
  
    return Category;
};