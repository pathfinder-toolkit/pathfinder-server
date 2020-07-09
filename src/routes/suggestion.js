const express = require("express");
const suggestionRouter = express.Router();

const {
  findSuggestionsFromParams
} = require('../controllers/suggestionController');

suggestionRouter.get("/suggestions/:subject/:value", findSuggestionsFromParams);

module.exports = suggestionRouter;