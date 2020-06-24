const express = require("express");
const editorRouter = express.Router();

const {
    getAreas,
    getOptionsForArea
} = require('../controllers/editorController');

editorRouter.get("/editor/areas", getAreas);

editorRouter.get("/editor/options/:area", (request, response) => {
    response.json(
      {
        "materials": ["Wood", "Stone", "Concrete"],
        "roofTypes": ["Roof 1", "Roof 2", "Roof 3"],
        "ventilationTypes": ["Gravity based", "Machine based", "Mixed type"],
        "heatingTypes": ["Heating 1", "Heating 2", "Heating 3"],
        "buildingTypes": ["Building 1", "Building 2", "Building 3"]
      }
    );
});

editorRouter.get('/test/:area', getOptionsForArea)

module.exports = editorRouter;