const express = require("express");
const adminRouter = express.Router();

const {
    checkJwt
} = require('../utils/auth');

const {
    checkAdminStatus,
    confirmAdminStatus,
    getFeedbackRecipients
} = require('../controllers/adminController');

adminRouter.get("/admin", checkJwt, checkAdminStatus, confirmAdminStatus);

adminRouter.get("/admin/feedback/recipients", checkJwt, checkAdminStatus, getFeedbackRecipients);

module.exports = adminRouter;