const dotenv = require("dotenv");
dotenv.config();

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

const Pool = require("pg").Pool;
const pool = new Pool(connectionString);

const getAreas = (request, response) => {
  pool.connect().then(client => {
  client.query('SELECT * FROM public."Areas";').then(res => {
    client.release()
    let areas = [];
    res.rows.forEach((row) => {
      areas.push(row.areaName)
    })
    response.status(200).json(areas)
  })
  .catch(e => {
    client.release()
    console.error('query error', e.message, e.stack)
  })
})
};

module.exports = {
  getAreas
};