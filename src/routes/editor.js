const express = require("express");
const editorRouter = express.Router();

const {
    getAreas,
    getOptionsForArea
} = require('../controllers/editorController');

editorRouter.get("/editor/areas", getAreas);

editorRouter.get('/editor/options/:area', getOptionsForArea)

module.exports = editorRouter;