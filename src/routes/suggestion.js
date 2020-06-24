const express = require("express");
const suggestionRouter = express.Router();

suggestionRouter.get("/suggestions/:subject/:value", (request, response) => {
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

module.exports = suggestionRouter;