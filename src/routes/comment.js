const express = require("express");
const commentRouter = express.Router();

commentRouter.get("/comments/:subject", (request, response) => {
    response.json(
      [
        {
          "commentText": "Mock positive comment",
          "commentSubject": "Main subject 1",
          "date": "2020-05-26 19:13:03",
          "author": "John Doe",
          "sentiment": "positive"
        },
        {
          "commentText": "Mock negative comment with anonymous author",
          "commentSubject": "Main subject 2",
          "date": "2020-05-28 15:00:01",
          "sentiment": "negative"
        },
        {
          "commentText": "Mock neutral comment",
          "commentSubject": "Main subject 3",
          "commentSecondarySubject": "Secondary subject",
          "date": "2020-05-31 15:12:43",
          "author": "Jane Doe",
          "sentiment": "negative"
        }
      ]
    );
});

module.exports = commentRouter;