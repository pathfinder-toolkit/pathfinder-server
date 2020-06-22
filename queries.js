const dotenv = require("dotenv");
dotenv.config();

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

const Pool = require("pg").Pool;
const pool = new Pool(connectionString);

const getAreas = async (request, response) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT "areaName" FROM public."Areas";');
    let areas = [];
    result.rows.forEach((row) => {
      areas.push(row.areaName)
    });
    response.status(200).json(areas);
  } catch(e) {
    console.error(e.message, e.stack)
  } finally {
    client.release()
  }
};

module.exports = {
  getAreas
};