const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const db = require("./queries");
const port = process.env.PORT || 3300;

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-cwz8v54y.eu.auth0.com/.well-known/jwks.json`
  }),

  audience: 'https://api-pathfinder.herokuapp.com/',
  issuer: `https://dev-cwz8v54y.eu.auth0.com/`,
  algorithms: ['RS256']
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/authorized", function (req, res) {
  res.send("Secured Resource");
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
