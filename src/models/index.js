const { Sequelize } = require("sequelize")

const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
   host: process.env.DATABASE_HOST,
   port: 5432,
   logging: console.log,
   maxConcurrentQueries: 100,
   dialect: 'postgres',
   dialectOptions: {
       ssl: { rejectUnauthorized: false },
   },
   pool: { maxConnections: 5, maxIdleTime: 30},
   language: 'en'
})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Area = require("./editor/AreaModel.js")(sequelize, Sequelize);
db.Material = require("./editor/MaterialModel.js")(sequelize, Sequelize);
db.RoofType = require("./editor/RoofTypeModel.js")(sequelize, Sequelize);
db.VentilationType = require("./editor/VentilationTypeModel.js")(sequelize, Sequelize);
db.HeatingType = require("./editor/HeatingTypeModel.js")(sequelize, Sequelize);
db.BuildingType = require("./editor/BuildingTypeModel.js")(sequelize,Sequelize);
db.Building = require("./building/BuildingModel.js")(sequelize, Sequelize);
db.Category = require("./building/CategoryModel.js")(sequelize, Sequelize);
db.Component = require("./building/ComponentModel.js")(sequelize, Sequelize);
db.ComponentValue = require("./building/ComponentValueModel.js")(sequelize, Sequelize);
db.Subject = require("./building/SubjectModel.js")(sequelize, Sequelize);

db.Area.hasMany(db.Material, { foreignKey: 'idArea', as: 'materials' });
db.Material.belongsTo(db.Area, { foreignKey: 'idArea' });
db.Area.hasMany(db.RoofType, { foreignKey: 'idArea' , as: 'roofTypes'});
db.RoofType.belongsTo(db.Area, { foreignKey: 'idArea' });
db.Area.hasMany(db.VentilationType, { foreignKey: 'idArea' , as: 'ventilationTypes'});
db.VentilationType.belongsTo(db.Area, { foreignKey: 'idArea' });
db.Area.hasMany(db.HeatingType, { foreignKey: 'idArea' , as: 'heatingTypes'});
db.HeatingType.belongsTo(db.Area, { foreignKey: 'idArea' });
db.Area.hasMany(db.BuildingType, { foreignKey: 'idArea' , as: 'buildingTypes'});
db.BuildingType.belongsTo(db.Area, { foreignKey: 'idArea' });

db.Building.hasMany(db.Category, { foreignKey: 'idBuilding', as: 'categories'});
db.Category.belongsTo(db.BuildingType, { foreignKey: 'idBuilding'});
db.Category.belongsToMany(db.Component, { through: 'CategoryComponents', });
db.Component.belongsToMany(db.Category, { through: 'CategoryComponents', as: 'components'});
db.Component.hasOne(db.ComponentValue, { foreignKey: 'idComponent', as: 'value'});
db.ComponentValue.belongsTo(db.Component, { foreignKey: 'idComponent'});
db.Subject.hasMany(db.Component, {foreignKey: 'idSubject', as: 'component'});
db.Component.belongsTo(db.Subject, {foreignKey: 'idSubject'});


(async () => {
    await db.sequelize.sync();
})();



module.exports = db;