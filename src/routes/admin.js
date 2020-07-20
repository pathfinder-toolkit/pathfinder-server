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
    getSelectableOptionsFromParams,
    postNewSuggestion,
    getAllSuggestionsFromIdentifier,
    updateExistingSuggestion,
    deleteExistingSuggestion
} = require('../controllers/adminController');

adminRouter.get("/admin", checkJwt, checkAdminStatus, confirmAdminStatus);

adminRouter.get("/admin/feedback/recipients", checkJwt, checkAdminStatus, getFeedbackRecipients);

adminRouter.put("/admin/feedback/recipients", checkJwt, checkAdminStatus, updateFeedbackRecipients);

adminRouter.get("/admin/suggestions/subjects", checkJwt, checkAdminStatus, getAvailableSuggestionSubjects);

adminRouter.get("/admin/suggestions/subject/:identifier", checkJwt, checkAdminStatus, getSelectableOptionsFromParams)

//adminRouter.post("/admin/suggestion", checkJwt, checkAdminStatus, postNewSuggestion);
adminRouter.post("/admin/suggestion", postNewSuggestion);

//adminRouter.get("/admin/suggestions/all/:identifier", checkJwt, checkAdminStatus, getAllSuggestionsFromIdentifier);

//adminRouter.put("/admin/suggestion/:id", checkJwt, checkAdminStatus, updateExistingSuggestion);

//adminRouter.delete("/admin/suggestion/:id", checkJwt, checkAdminStatus, deleteExistingSuggestion);

module.exports = adminRouter;