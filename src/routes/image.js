const express = require("express");
const imageRouter = express.Router();

imageRouter.get('/image', (request, response) => {
    response.status(200).send("Endpoint functional");
})

module.exports = imageRouter;