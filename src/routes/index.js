const express = require('express');
const buildingRouter = require('./building');
const commentRouter = require('./comment');
const editorRouter = require('./editor');
const suggestionRouter = require('./suggestion');
const imageRouter = require('./image');
const adminRouter = require('./admin');
const feedbackRouter = require('./feedback');

const apiRouter = express.Router();

apiRouter.use('', buildingRouter);
apiRouter.use('', commentRouter);
apiRouter.use('', editorRouter);
apiRouter.use('', suggestionRouter);
apiRouter.use('', imageRouter);
apiRouter.use('', adminRouter);
apiRouter.use('', feedbackRouter);

module.exports = apiRouter;