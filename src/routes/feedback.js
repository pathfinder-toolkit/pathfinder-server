const express = require("express");
const feedbackRouter = express.Router();

const {
    checkRecaptcha,
    sendFeedback
} = require("../controllers/feedbackController");

feedbackRouter.post("/feedback/recaptcha", checkRecaptcha, sendFeedback);

module.exports = feedbackRouter;