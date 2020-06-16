const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const allowedOrigins = [
  "http://localhost:3000",
  "https://pathfinder-toolkit.herokuapp.com",
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
  response.json(
    {
      "details": {
        "name": {
          "propertyName": "Name",
          "value": "Talo"
        },
        "area": {
          "propertyName": "Area",
          "value": "Northern Finland"
        },
        "year": {
          "propertyName": "Construction year",
          "value": 1900
        },
        "floorArea": {
          "propertyName": "Floor area(in square meters)",
          "value": 62
        },
        "heatedFloorArea": {
          "propertyName": "Heated floor area(in square meters)",
          "value": 50
        },
        "floorsAmount": {
          "propertyName": "Amount of floors",
          "value": 2
        },
        "description": {
          "propertyName": "Description of building",
          "value": "Quisque vulputate enim ligula, sed lobortis metus commodo efficitur. Suspendisse ante lectus, sagittis eu diam a, convallis aliquam eros. Vivamus consequat sagittis nunc in euismod. Vivamus laoreet erat elit. Praesent erat diam, dapibus a purus ac, scelerisque consequat tortor. Aliquam nunc metus, ultricies et lacus a, rutrum feugiat ligula. Proin a enim tortor."
        },
        "image": {
          "propertyName": "Image",
          "value": "/static/media/frontpage_house.294aaf25.jpg"
        }
      },
      "heating": {
        "heatingSystem": {
          "propertyName": "Heating System",
          "value": "Oil",
          "suggestions": [
            {
              "suggestionText": "Nulla urna lorem, porttitor vehicula risus vitae, ultrices commodo nisl. Nullam viverra mollis tortor at vestibulum.",
              "priority": 95
            }
          ],
          "comments": [
            {
              "commentText": "Donec dapibus facilisis nisl vel posuere. Morbi bibendum magna ac lacus vestibulum, eu egestas lacus viverra.",
              "date": "2020-06-15 12:14:34",
              "author": "John Doe",
              "sentiment": "positive"
            }
          ]
        },
        "heatingSource": {
          "propertyName": "Heating Source",
          "value": "Source 1"
        },
        "annualCost": {
          "propertyName": "Annual cost",
          "value": 300
        }
      },
      "electricity": {
        "annualUse": {
          "propertyName": "Annual use",
          "value": 500
        },
        "annualCost": {
          "propertyName": "Annual cost",
          "value": 250
        }
      },
      "structure": {
        "wallMaterial": {
          "propertyName": "Wall material",
          "value": "Wood",
          "suggestions": [
            {
              "suggestionText": "Sed sapien turpis, rutrum et semper in, eleifend nec elit. Etiam lobortis, ante quis varius vehicula, magna urna ultricies justo, non interdum est lectus a est.",
              "priority": 30
            }
          ],
          "comments": [
            {
              "commentText": "Quisque et convallis diam, eget interdum sapien. Vivamus felis nulla, condimentum a volutpat vel, luctus id odio. ",
              "date": "2020-06-15 15:44:23",
              "sentiment": "negative"
            }
          ]
        },
        "wallThickness": {
          "propertyName": "Wall Thickness",
          "value": 16
        },
        "windowAmount": {
          "propertyName": "Amount of windows",
          "value": 12
        },
        "doorMaterial": {
          "propertyName": "Door material",
          "value": "Wood"
        },
        "doorAmount": {
          "propertyName": "Amount of doors",
          "value": 4
        },
        "roofMaterial": {
          "propertyName": "Roof material",
          "value": "Roof material 1"
        },
        "roofInsulation": {
          "propertyName": "Roof insulation",
          "value": true
        }
      },
      "ventilation": {
        "ventilationSystem": {
          "propertyName": "Ventilation system",
          "value": "Ventilation system 1",
          "suggestions": [
            {
              "suggestionText": "Vivamus laoreet erat elit. Praesent erat diam, dapibus a purus ac, scelerisque consequat tortor. Aliquam nunc metus, ultricies et lacus a, rutrum feugiat ligula.",
              "priority": 1
            }
          ],
          "comments": [
            {
              "commentText": "Proin a enim tortor. Cras vestibulum bibendum libero, a pulvinar turpis eleifend fringilla. Suspendisse et nunc hendrerit, lacinia enim eu, tincidunt dolor.",
              "date": "2020-06-16 11:44:23",
              "author": "Jane Doe",
              "sentiment": "neutral"
            }
          ]
        }
      }
    }
  );
});

app.get("/buildings/me", (request, response) => {
  response.json(
    [
      {
        "name": "Burj Khalifa",
        "image": "/static/media/frontpage_house.294aaf25.jpg",
        "creationDate": "2020-05-24 13:25:01",
        "slug": "burjkhalifa"
      },
      {
        "name": "Shanghai Tower",
        "image": "/static/media/frontpage_house.294aaf25.jpg",
        "creationDate": "2020-05-16 11:44:23",
        "slug": "shanghaitower"
      },
      {
        "name": "Makkah Royal Clock Tower",
        "image": "/static/media/frontpage_house.294aaf25.jpg",
        "creationDate": "2020-05-25 12:10:03",
        "slug": "makkahroyalclocktower"
      },
      {
        "name": "Ping An Finance Center",
        "image": "/static/media/frontpage_house.294aaf25.jpg",
        "creationDate": "2020-05-16 11:44:23",
        "slug": "pinganfinancecenter"
      },
      {
        "name": "Lotte World Tower",
        "image": "/static/media/frontpage_house.294aaf25.jpg",
        "creationDate": "2020-05-26 19:13:03",
        "slug": "lotteworldtower"
      },
      {
        "name": "One World Trade Center",
        "image": "/static/media/frontpage_house.294aaf25.jpg",
        "creationDate": "2020-05-28 15:00:01",
        "slug": "oneworldtradecenter"
      },
      {
        "name": "Tianjin CTF Finance Centre",
        "image": "/static/media/frontpage_house.294aaf25.jpg",
        "creationDate": "2020-05-31 15:12:43",
        "slug": "tianjinctffinancecenter"
      }
      
    ]
  );
});

app.get("/suggestions/:subject/:value", (request, response) => {
  response.json(
    [
      {
        "suggestionText": "Mock suggestion 1",
        "priority": 100
      },
      {
        "suggestionText": "Mock suggestion 2",
        "priority": 5
      },
    ]
  );
});

app.get("/comments/:subject", (request, response) => {
  response.json(
    [
      {
        "commentText": "Mock positive comment",
        "date": "2020-05-26 19:13:03",
        "author": "John Doe",
        "sentiment": "positive"
      },
      {
        "commentText": "Mock negative comment with anonymous author",
        "date": "2020-05-28 15:00:01",
        "sentiment": "negative"
      },
      {
        "commentText": "Mock neutral comment",
        "date": "2020-05-31 15:12:43",
        "author": "Jane Doe",
        "sentiment": "negative"
      }
    ]
  );
});

app.get("/buildings", db.getBuildings);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
