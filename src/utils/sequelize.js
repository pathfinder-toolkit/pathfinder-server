const { Sequelize } = require('sequelize');
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

module.exports = sequelize;