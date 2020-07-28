const express = require("express");
const commentRouter = express.Router();

const {
  checkJwt
} = require('../utils/auth');

const {
  getCommentsFromParams,
  createNewComment,
  submitReportOnComment
} = require("../controllers/commentController");

commentRouter.get("/comments/:subject", getCommentsFromParams);

commentRouter.post("/comments", checkJwt, createNewComment);

commentRouter.post("/comment/report/:id", checkJwt, submitReportOnComment);

module.exports = commentRouter;