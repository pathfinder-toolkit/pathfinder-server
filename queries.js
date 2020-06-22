const dotenv = require("dotenv");
dotenv.config();

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

const Pool = require("pg").Pool;
const pool = new Pool(connectionString);

const getAreas = (request, response) => {
  pool.query('SELECT * FROM public."Areas";', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getAreas
};