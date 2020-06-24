const express = require("express");
const buildingRouter = express.Router();

buildingRouter.get("/buildings/me", (request, response) => {
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

buildingRouter.get("/building/:buildingId", (request, response) => {
    response.json(
      {
        "slug": "talonnimi",
        "details": {
          "name": {
            "propertyName": "Name",
            "value": "Talon nimi"
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

module.exports = buildingRouter;