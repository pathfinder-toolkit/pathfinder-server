const express = require("express");
const buildingRouter = express.Router();

const {
  checkJwt
} = require('../utils/auth');

const {
  getSampleBuilding,
  postBuildingFromData,
  getBuildingsForUser,
  getFullBuildingDetailsFromSlug
} = require('../controllers/buildingController');

buildingRouter.get("/building", getSampleBuilding);

buildingRouter.post("/building", checkJwt, postBuildingFromData);

buildingRouter.get("/buildings/me", checkJwt,  getBuildingsForUser);

//buildingRouter.get("/building/:slug", getFullBuildingDetailsFromSlug);

buildingRouter.get("/building/:slug", checkJwt, getFullBuildingDetailsFromSlug);

/*buildingRouter.get("/buildings/me", checkJwt, (request, response) => {

  console.log(request.user.sub);
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

buildingRouter.get("/building/:buildingId", checkJwt, (request, response) => {
    response.json(
      {
        "slug": "talonnimi",
        "details": {
          "name": {
            "componentDescription": "Name",
            "value": "Talon nimi",
            "hasSuggestions": false
          },
          "area": {
            "componentDescription": "Area",
            "value": "Northern Finland",
            "hasSuggestions": false
          },
          "year": {
            "componentDescription": "Construction year",
            "value": 1900,
            "hasSuggestions": false
          },
          "description": {
            "componentDescription": "Description of building",
            "value": "Quisque vulputate enim ligula, sed lobortis metus commodo efficitur. Suspendisse ante lectus, sagittis eu diam a, convallis aliquam eros. Vivamus consequat sagittis nunc in euismod. Vivamus laoreet erat elit. Praesent erat diam, dapibus a purus ac, scelerisque consequat tortor. Aliquam nunc metus, ultricies et lacus a, rutrum feugiat ligula. Proin a enim tortor.",
            "hasSuggestions": false
          },
          "buildingType": {
            "componentDescription": "Building type",
            "value": "Building type 2",
            "hasSuggestions": false
          },
          "image": {
            "componentDescription": "Image",
            "value": "/static/media/frontpage_house.294aaf25.jpg",
            "hasSuggestions": false
          },
          "floorsAmount": {
            "componentDescription": "Number of floors",
            "value": 2,
            "hasSuggestions": false
          },
          "floorArea": {
            "componentDescription": "Floor area(in square meters)",
            "value": 62,
            "hasSuggestions": false
          },
          "heatedFloorArea": {
            "componentDescription": "Heated floor area(in square meters)",
            "value": 50,
            "hasSuggestions": false
          },
          "annualConsumption": {
            "componentDescription": "Annual consumption",
            "value": 800,
            "hasSuggestions": false
          },
          "annualCost": {
            "componentDescription": "Annual cost",
            "value": 400,
            "hasSuggestions": false
          },
          "annualHeatingConsumption": {
            "componentDescription": "Annual heating consumption",
            "value": 300,
            "hasSuggestions": false
          },
          "annualHeatingCost": {
            "componentDescription": "Annual heating cost",
            "value": 150,
            "hasSuggestions": false
          }
        },
        "structure": {
          "wallMaterial": {
            "componentDescription": "Wall material",
            "value": "Wood",
            "hasSuggestions": true,
            "suggestions": [
              {
                "suggestionText": "Sed sapien turpis, rutrum et semper in, eleifend nec elit. Etiam lobortis, ante quis varius vehicula, magna urna ultricies justo, non interdum est lectus a est.",
                "priority": 30,
                "suggestionSubject": "Wood",
              }
            ],
            "comments": [
              {
                "commentText": "Quisque et convallis diam, eget interdum sapien. Vivamus felis nulla, condimentum a volutpat vel, luctus id odio. ",
                "commentSubject": "Wall Material",
                "date": "2020-06-15 15:44:23",
                "sentiment": "negative"
              }
            ]
          },
          "wallThickness": {
            "componentDescription": "Wall Thickness",
            "value": 16,
            "hasSuggestions": true
          },
          "windowType": {
            "componentDescription": "Window type",
            "value": "Window 1",
            "hasSuggestions": true
          },
          "windowAmount": {
            "componentDescription": "Number of windows",
            "value": 12,
            "hasSuggestions": true
          },
          "heatedWindowType": {
            "componentDescription": "Heated area window type",
            "value": "Window 2",
            "hasSuggestions": true
          },
          "heatedWindowAmount": {
            "componentDescription": "Number of windows in heated area",
            "value": 8,
            "hasSuggestions": true
          },
          "doorMaterial": {
            "componentDescription": "Door material",
            "value": "Wood",
            "hasSuggestions": true
          },
          "doorAmount": {
            "componentDescription": "Amount of doors",
            "value": 4,
            "hasSuggestions": true
          },
          "roofMaterial": {
            "componentDescription": "Roof material",
            "value": "Roof material 1",
            "hasSuggestions": true
          },
          "roofInsulation": {
            "componentDescription": "Roof insulation",
            "value": true,
            "hasSuggestions": true
          },
          "roofInsulationThickness": {
            "componentDescription": "Roof insulation thickness",
            "value": 3.5,
            "hasSuggestions": true
          }
        },
        "heating": {
          "heatingSystem": [
            {
              "componentDescription": "Heating System",
              "value": "Oil",
              "hasSuggestions": true,
              "isCurrent": true,
              "suggestions": [
                {
                  "suggestionText": "Nulla urna lorem, porttitor vehicula risus vitae, ultrices commodo nisl. Nullam viverra mollis tortor at vestibulum.",
                  "priority": 95
                }
              ],
              "comments": [
                {
                  "commentText": "Donec dapibus facilisis nisl vel posuere. Morbi bibendum magna ac lacus vestibulum, eu egestas lacus viverra.",
                  "commentSubject": "Heating System",
                  "commentSecondarySubject": "Oil",
                  "date": "2020-06-15 12:14:34",
                  "author": "John Doe",
                  "sentiment": "positive"
                }
              ]
            }
          ],
          "heatingSource": [
            {
              "componentDescription": "Heating Source",
              "value": "Source 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ]
        },
        "electric": {
          "annualUse": {
            "componentDescription": "Annual use",
            "value": 500,
            "hasSuggestions": true
          },
          "annualCost": {
            "componentDescription": "Annual cost",
            "value": 250,
            "hasSuggestions": true
          }
        },
        "water": {
          "heatedWaterEnergySource": [
            {
              "componentDescription": "Heated water energy source",
              "value": "Heat energy source 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ]
        },
        "ventilation": {
          "ventilationSystem": [
            {
              "componentDescription": "Ventilation system",
              "value": "Ventilation system 1",
              "hasSuggestions": true,
              "isCurrent": true,
              "suggestions": [
                {
                  "suggestionText": "Vivamus laoreet erat elit. Praesent erat diam, dapibus a purus ac, scelerisque consequat tortor. Aliquam nunc metus, ultricies et lacus a, rutrum feugiat ligula.",
                  "priority": 1
                }
              ],
              "comments": [
                {
                  "commentText": "Proin a enim tortor. Cras vestibulum bibendum libero, a pulvinar turpis eleifend fringilla. Suspendisse et nunc hendrerit, lacinia enim eu, tincidunt dolor.",
                  "commentSubject": "Ventilation system",
                  "date": "2020-06-16 11:44:23",
                  "author": "Jane Doe",
                  "sentiment": "neutral"
                }
              ]
            }
          ]
        },
        "renewable": {
          "heatPump": [
            {
              "componentDescription": "Heat pump",
              "value": "Heat pump type 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "solarHeat": [
            {
              "componentDescription": "Solar energy heat",
              "value": "Vacuum pipes",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "solarElectric": [
            {
              "componentDescription": "Solar energy electricity",
              "value": "1-phase",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "bioMass": [
            {
              "componentDescription": "Biomass energy",
              "value": "Wooden pellets",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "chp": [
            {
              "componentDescription": "Combined heat and power",
              "value": "Combined source 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ]
        }
      }
    );
});*/

module.exports = buildingRouter;