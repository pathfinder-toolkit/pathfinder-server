const express = require("express");
const commentRouter = express.Router();

const {
  checkJwt
} = require('../utils/auth');

const {
  getCommentsFromParams,
  createNewComment
} = require("../controllers/commentController");

commentRouter.get("/comments/:subject", getCommentsFromParams);

commentRouter.post("/comments", checkJwt, createNewComment);

module.exports = commentRouter;