const express = require("express");
const adminRouter = express.Router();

const {
    checkJwt
} = require('../utils/auth');

const {
    checkAdminStatus,
    confirmAdminStatus,
    getFeedbackRecipients,
    updateFeedbackRecipients,
    getAvailableSuggestionSubjects,
    getSelectableOptionsFromParams
} = require('../controllers/adminController');

adminRouter.get("/admin", checkJwt, checkAdminStatus, confirmAdminStatus);

adminRouter.get("/admin/feedback/recipients", checkJwt, checkAdminStatus, getFeedbackRecipients);

adminRouter.put("/admin/feedback/recipients", checkJwt, checkAdminStatus, updateFeedbackRecipients);

adminRouter.get("/admin/suggestions/subjects", checkJwt, checkAdminStatus, getAvailableSuggestionSubjects);

adminRouter.get("/admin/suggestions/subject/:identifier", checkJwt, checkAdminStatus, getSelectableOptionsFromParams)

module.exports = adminRouter;