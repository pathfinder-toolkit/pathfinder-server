const dotenv = require("dotenv");
dotenv.config();

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

const Pool = require("pg").Pool;
const pool = new Pool(connectionString);

const { Sequelize } = require('sequelize');
const  sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
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



const getAreas = async (request, response) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT "areaName" FROM public."Areas";');
    let areas = [];
    result.rows.forEach((row) => {
      areas.push(row.areaName)
    });

    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    response.status(200).json(areas);
  } catch(e) {
    console.error(e.message, e.stack)
  } finally {
    client.release()
  }
};

const getOptions = async (request, response) => {
  const client = await pool.connect();
  try {
    const area = request.params.area;
    let query = 'SELECT public."Areas"."idArea" FROM public."Areas" WHERE public."Areas"."areaName"=\'' + area + '\';'
    const resultAreaId = await client.query(query);
    const areaId = resultAreaId.rows[0].idArea;

    query = 'SELECT public."Materials"."materialValue" FROM public."Materials" WHERE public."Materials"."idArea"=' + areaId;
    const resultMaterialValues = await client.query(query);
    let materials = [];
    resultMaterialValues.rows.forEach((row) => {
      materials.push(row.materialValue);
    })

    response.status(200).json(materials);
  } catch(e) {
    console.error(e.message, e.stack)
  } finally {
    client.release()
  }
};

module.exports = {
  getAreas,
  getOptions
};