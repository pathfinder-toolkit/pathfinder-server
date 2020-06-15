
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = 3300;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/buildings", db.getBuildings);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
