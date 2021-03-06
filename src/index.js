const express = require("express");
const app = express();
const cors = require("cors");
const cleanup = require("./utils/schedule");
const url = require('url');
const querystring = require('querystring');
app.use(cors());

const apiRouter = require('./routes');

const allowedOrigins = [
  "http://localhost:3000",
  "https://pathfinder-toolkit.herokuapp.com",
];

const port = process.env.PORT || 3300;

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Pathfinder API" });
});



app.use('', apiRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});