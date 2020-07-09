const express = require("express");
const imageRouter = express.Router();

const {
    checkJwt
  } = require('../utils/auth');

const { uploadImageToCloudinary } = require('../controllers/imageController');

imageRouter.post('/image', checkJwt, uploadImageToCloudinary);

module.exports = imageRouter;