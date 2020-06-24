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

db.Area = require("./AreaModel.js")(sequelize, Sequelize);
db.Material = require("./MaterialModel.js")(sequelize, Sequelize);

db.Area.hasMany(db.Material, { foreignKey: 'idArea' });
db.Material.belongsTo(db.Area, { foreignKey: 'idArea' });

db.sequelize.sync();

module.exports = db;