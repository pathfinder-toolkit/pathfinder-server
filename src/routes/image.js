const express = require("express");
const imageRouter = express.Router();

const fileUpload = require("express-fileupload");

const {
    checkJwt
  } = require('../utils/auth');

const { 
    uploadImageToCloudinary,
    getUserImages
} = require('../controllers/imageController');

imageRouter.use(fileUpload({
    limits: { 
        fileSize: 10 * 1024 * 1024
    },
    useTempFiles: true
}));

imageRouter.post('/image', checkJwt, uploadImageToCloudinary);

imageRouter.get('/images', checkJwt, getUserImages);

module.exports = imageRouter;