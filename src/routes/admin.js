const express = require("express");
const adminRouter = express.Router();

const {
    checkJwt
} = require('../utils/auth');

const {
    verifyAdminStatus
} = require('../controllers/adminController');

adminRouter.get("/admin", checkJwt, verifyAdminStatus);

module.exports = adminRouter;