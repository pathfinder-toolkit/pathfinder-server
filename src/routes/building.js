const express = require("express");
const buildingRouter = express.Router();

const {
  checkJwt
} = require('../utils/auth');

const {
  getSampleBuilding
} = require('../controllers/buildingController');

buildingRouter.get("/building/test", getSampleBuilding)

buildingRouter.get("/buildings/me", checkJwt, (request, response) => {

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

buildingRouter.get("/building", (request, response) => {
  response.json(
    {
      "details": {
        "name": {
          "propertyName": "Name",
          "value": "",
          "hasSuggestions": false
        },
        "area": {
          "propertyName": "Area",
          "value": "",
          "hasSuggestions": false
        },
        "year": {
          "propertyName": "Construction year",
          "value": "",
          "hasSuggestions": false
        },
        "description": {
          "propertyName": "Description",
          "value": "",
          "hasSuggestions": false
        },
        "buildingType": {
          "propertyName": "Building type",
          "value": "",
          "hasSuggestions": false
        },
        "image": {
          "propertyName": "Image",
          "value": "",
          "hasSuggestions": false
        },
        "floorsAmount": {
          "propertyName": "Number of floors",
          "value": "",
          "hasSuggestions": false
        },
        "floorArea": {
          "propertyName": "Floor area",
          "value": "",
          "hasSuggestions": false
        },
        "heatedFloorArea": {
          "propertyName": "Heated floor area",
          "value": "",
          "hasSuggestions": false
        },
        "annualConsumption": {
          "propertyName": "Annual consumption",
          "value": "",
          "hasSuggestions": false
        },
        "annualCost": {
          "propertyName": "Annual cost",
          "value": "",
          "hasSuggestions": false
        },
        "annualHeatingConsumption": {
          "propertyName": "Annual heating consumption",
          "value": "",
          "hasSuggestions": false
        },
        "annualHeatingCost": {
          "propertyName": "Annual heating cost",
          "value": "",
          "hasSuggestions": false
        }
      },
      "structure": {
        "wallMaterial": {
          "propertyName": "Wall material",
          "value": "",
          "hasSuggestions": true
        },
        "wallThickness": {
          "propertyName": "Wall thickness",
          "value": "",
          "hasSuggestions": true
        },
        "windowType": {
          "propertyName": "Window type",
          "value": "",
          "hasSuggestions": true
        },
        "windowAmount": {
          "propertyName": "Number of windows",
          "value": "",
          "hasSuggestions": true
        },
        "heatedWindowType": {
          "propertyName": "Heated area window type",
          "value": "",
          "hasSuggestions": true
        },
        "heatedWindowAmount": {
          "propertyName": "Number of windows in heated area",
          "value": "",
          "hasSuggestions": true
        },
        "doorMaterial": {
          "propertyName": "Door material",
          "value": "",
          "hasSuggestions": true
        },
        "doorAmount": {
          "propertyName": "Number of doors",
          "value": 0,
          "hasSuggestions": true
        },
        "roofMaterial": {
          "propertyName": "Roof material",
          "value": "",
          "hasSuggestions": true
        },
        "roofInsulation": {
          "propertyName": "Roof insulation",
          "value": "",
          "hasSuggestions": true
        },
        "roofInsulationThickness": {
          "propertyName": "Roof insulation thickness",
          "value": "",
          "hasSuggestions": true
        }
      },
      "heating": {
        "heatingSystem": [
          {
            "propertyName": "Heating system",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true
          }
        ],
        "heatingSource": [
          {
            "propertyName": "Heating source",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true
          }
        ]
      },
      "electric": {
        "annualUse": {
          "propertyName": "Annual electricity use",
          "value": "",
          "hasSuggestions": true
        },
        "annualCost": {
          "propertyName": "Annual electricity cost",
          "value": "",
          "hasSuggestions": true
        }
      },
      "water": {
        "heatedWaterEnergySource": [
          {
            "propertyName": "Heated water energy source",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true,
          }
        ]
      },
      "ventilation": {
        "ventilationSystem": [
          {
            "propertyName": "Ventilation system",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true
          }
        ]
      },
      "renewable": {
        "heatPump": [
          {
            "propertyName": "Heat pump",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true,
          }
        ],
        "solarHeat": [
          {
            "propertyName": "Solar energy heat",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true
          }
        ],
        "solarElectric": [
          {
            "propertyName": "Solar energy electricity",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true
          }
        ],
        "bioMass": [
          {
            "propertyName": "Biomass energy",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true
          }
        ],
        "chp": [
          {
            "propertyName": "Combined heat and power",
            "value": "",
            "hasSuggestions": true,
            "isCurrent": true
          }
        ]
      }
    }
  )
});

buildingRouter.get("/building/:buildingId", checkJwt, (request, response) => {
    response.json(
      {
        "slug": "talonnimi",
        "details": {
          "name": {
            "propertyName": "Name",
            "value": "Talon nimi",
            "hasSuggestions": false
          },
          "area": {
            "propertyName": "Area",
            "value": "Northern Finland",
            "hasSuggestions": false
          },
          "year": {
            "propertyName": "Construction year",
            "value": 1900,
            "hasSuggestions": false
          },
          "description": {
            "propertyName": "Description of building",
            "value": "Quisque vulputate enim ligula, sed lobortis metus commodo efficitur. Suspendisse ante lectus, sagittis eu diam a, convallis aliquam eros. Vivamus consequat sagittis nunc in euismod. Vivamus laoreet erat elit. Praesent erat diam, dapibus a purus ac, scelerisque consequat tortor. Aliquam nunc metus, ultricies et lacus a, rutrum feugiat ligula. Proin a enim tortor.",
            "hasSuggestions": false
          },
          "buildingType": {
            "propertyName": "Building type",
            "value": "Building type 2",
            "hasSuggestions": false
          },
          "image": {
            "propertyName": "Image",
            "value": "/static/media/frontpage_house.294aaf25.jpg",
            "hasSuggestions": false
          },
          "floorsAmount": {
            "propertyName": "Number of floors",
            "value": 2,
            "hasSuggestions": false
          },
          "floorArea": {
            "propertyName": "Floor area(in square meters)",
            "value": 62,
            "hasSuggestions": false
          },
          "heatedFloorArea": {
            "propertyName": "Heated floor area(in square meters)",
            "value": 50,
            "hasSuggestions": false
          },
          "annualConsumption": {
            "propertyName": "Annual consumption",
            "value": 800,
            "hasSuggestions": false
          },
          "annualCost": {
            "propertyName": "Annual cost",
            "value": 400,
            "hasSuggestions": false
          },
          "annualHeatingConsumption": {
            "propertyName": "Annual heating consumption",
            "value": 300,
            "hasSuggestions": false
          },
          "annualHeatingCost": {
            "propertyName": "Annual heating cost",
            "value": 150,
            "hasSuggestions": false
          }
        },
        "structure": {
          "wallMaterial": {
            "propertyName": "Wall material",
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
            "propertyName": "Wall Thickness",
            "value": 16,
            "hasSuggestions": true
          },
          "windowType": {
            "propertyName": "Window type",
            "value": "Window 1",
            "hasSuggestions": true
          },
          "windowAmount": {
            "propertyName": "Number of windows",
            "value": 12,
            "hasSuggestions": true
          },
          "heatedWindowType": {
            "propertyName": "Heated area window type",
            "value": "Window 2",
            "hasSuggestions": true
          },
          "heatedWindowAmount": {
            "propertyName": "Number of windows in heated area",
            "value": 8,
            "hasSuggestions": true
          },
          "doorMaterial": {
            "propertyName": "Door material",
            "value": "Wood",
            "hasSuggestions": true
          },
          "doorAmount": {
            "propertyName": "Amount of doors",
            "value": 4,
            "hasSuggestions": true
          },
          "roofMaterial": {
            "propertyName": "Roof material",
            "value": "Roof material 1",
            "hasSuggestions": true
          },
          "roofInsulation": {
            "propertyName": "Roof insulation",
            "value": true,
            "hasSuggestions": true
          },
          "roofInsulationThickness": {
            "propertyName": "Roof insulation thickness",
            "value": 3.5,
            "hasSuggestions": true
          }
        },
        "heating": {
          "heatingSystem": [
            {
              "propertyName": "Heating System",
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
              "propertyName": "Heating Source",
              "value": "Source 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ]
        },
        "electric": {
          "annualUse": {
            "propertyName": "Annual use",
            "value": 500,
            "hasSuggestions": true
          },
          "annualCost": {
            "propertyName": "Annual cost",
            "value": 250,
            "hasSuggestions": true
          }
        },
        "water": {
          "heatedWaterEnergySource": [
            {
              "propertyName": "Heated water energy source",
              "value": "Heat energy source 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ]
        },
        "ventilation": {
          "ventilationSystem": [
            {
              "propertyName": "Ventilation system",
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
              "propertyName": "Heat pump",
              "value": "Heat pump type 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "solarHeat": [
            {
              "propertyName": "Solar energy heat",
              "value": "Vacuum pipes",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "solarElectric": [
            {
              "propertyName": "Solar energy electricity",
              "value": "1-phase",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "bioMass": [
            {
              "propertyName": "Biomass energy",
              "value": "Wooden pellets",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ],
          "chp": [
            {
              "propertyName": "Combined heat and power",
              "value": "Combined source 1",
              "hasSuggestions": true,
              "isCurrent": true
            }
          ]
        }
      }
    );
});

module.exports = buildingRouter;