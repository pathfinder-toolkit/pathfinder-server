const express = require('express');
const buildingRouter = require('./building');
const commentRouter = require('./comment');
const editorRouter = require('./editor');
const suggestionRouter = require('./suggestion');
const imageRouter = require('./image');
const adminRouter = require('./admin');

const apiRouter = express.Router();

apiRouter.use('', buildingRouter);
apiRouter.use('', commentRouter);
apiRouter.use('', editorRouter);
apiRouter.use('', suggestionRouter);
apiRouter.use('', imageRouter);
apiRouter.use('', adminRouter);

module.exports = apiRouter;