const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const allowedOrigins = [
  "*",
];

const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const db = require("./queries");
const port = process.env.PORT || 3300;

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-cwz8v54y.eu.auth0.com/.well-known/jwks.json`,
  }),

  audience: "https://api-pathfinder.herokuapp.com/",
  issuer: `https://dev-cwz8v54y.eu.auth0.com/`,
  algorithms: ["RS256"],
});

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

app.get("/private", checkJwt, function (req, res) {
  res.json({
    message: "Private endpoint test.",
  });
});

app.get("/building/:buildingId", (request, response) => {
  response.json({ info: "Get building id" });
});

app.get("/buildings/me", (request, response) => {
  response.json({ info: "Get my buildings" });
});

app.get("/buildings", db.getBuildings);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
