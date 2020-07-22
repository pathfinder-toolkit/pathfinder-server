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
db.AreaComponent = require("./editor/AreaComponentModel.js")(sequelize, Sequelize);
db.AreaOption = require("./editor/AreaOptionModel.js")(sequelize, Sequelize);
// Old format, 5 models below are to be replaced with the 2 models above 
db.Material = require("./editor/MaterialModel.js")(sequelize, Sequelize);
db.RoofType = require("./editor/RoofTypeModel.js")(sequelize, Sequelize);
db.VentilationType = require("./editor/VentilationTypeModel.js")(sequelize, Sequelize);
db.HeatingType = require("./editor/HeatingTypeModel.js")(sequelize, Sequelize);
db.BuildingType = require("./editor/BuildingTypeModel.js")(sequelize,Sequelize);
db.Building = require("./building/BuildingModel.js")(sequelize, Sequelize);

db.Category = require("./building/CategoryModel.js")(sequelize, Sequelize);
db.Component = require("./building/ComponentModel.js")(sequelize, Sequelize);
db.ComponentValue = require("./building/ComponentValueModel.js")(sequelize, Sequelize);
db.ComponentMeta = require("./building/ComponentMetaModel.js")(sequelize, Sequelize);
db.Suggestion = require("./suggestions/SuggestionModel.js")(sequelize, Sequelize);
db.Comment = require("./comment/CommentModel.js")(sequelize, Sequelize);
db.Image = require("./image/ImageModel.js")(sequelize, Sequelize);
db.FeedbackRecipient = require("./admin/FeedbackRecipientModel.js")(sequelize, Sequelize);
db.SuggestionCondition = require("./suggestions/SuggestionConditionModel.js")(sequelize, Sequelize);

db.Area.hasMany(db.AreaComponent, { foreignKey: 'idArea', as: 'components'});
db.AreaComponent.belongsTo(db.Area, { foreignKey: 'idArea'});
db.AreaComponent.hasMany(db.AreaOption, { foreignKey: 'idAreaComponent', as: 'options'});
db.AreaOption.belongsTo(db.AreaComponent, { foreignKey: 'idAreaComponent'});

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
db.Category.belongsToMany(db.Component, { through: 'CategoryComponents', as: 'components'});
db.Component.belongsToMany(db.Category, { through: 'CategoryComponents'});
db.Component.hasOne(db.ComponentValue, { foreignKey: {name: 'idComponent'}, as: 'value'});
db.ComponentValue.belongsTo(db.Component, { foreignKey: 'idComponent'});
db.ComponentMeta.hasMany(db.Component, {foreignKey: 'idMeta'});
db.Component.belongsTo(db.ComponentMeta, {foreignKey: 'idMeta', as: 'meta'});
db.ComponentMeta.hasMany(db.Suggestion, {foreignKey: 'idMeta', as: 'suggestions'});
db.Suggestion.belongsTo(db.ComponentMeta, {foreignKey: 'idMeta', as: 'subject'});
db.ComponentMeta.hasMany(db.Comment, {foreignKey: 'idMeta'});
db.Comment.belongsTo(db.ComponentMeta, {foreignKey: 'idMeta', as: 'subject'});
db.Suggestion.hasMany(db.SuggestionCondition, {foreignKey: 'idSuggestion', as: 'conditions'});
db.SuggestionCondition.belongsTo(db.Suggestion, {foreignKey: 'idSuggestion'});
db.ComponentMeta.hasMany(db.SuggestionCondition, {foreignKey: 'idMeta'});
db.SuggestionCondition.belongsTo(db.ComponentMeta, {foreignKey: 'idMeta', as: 'conditionedBy'});
db.Suggestion.belongsToMany(db.Area, { through: 'AreaSuggestions', as: 'areas'});
db.Area.belongsToMany(db.Suggestion, {through: 'AreaSuggestions'});

// Uncomment below to sync models with database

/*(async () => {
    await db.sequelize.sync();
})();*/



module.exports = db;