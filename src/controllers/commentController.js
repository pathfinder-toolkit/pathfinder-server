const db = require('../models');
const { Comment, ComponentMeta } = require('../models');

const { getUserInfo } = require('../utils/auth');

const sequelize = db.sequelize;

const {
    makeExampleComments
} = require('./commentUtils/commentCreation');

const {
    commentsToResponse
} = require('../utils/JSONformatter');

const getCommentsFromParams = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const subject = request.params.subject;
        // Temporarily added to choose amount of comments to display
        const value = request.params.value;

        //await makeExampleComments(t);

        const comments = await Comment.findAll({
            include: {
                model: ComponentMeta,
                as: 'subject',
                where: {
                    componentName: subject
                },
                attributes: ['subject']
            }
        },
        {transaction: t});

        // Temporary (for testing purposes) : value is used to determine amount of comments shown (between 0-4).

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        shuffleArray(comments);

        const amount = Math.min( Math.abs(value), comments.length );

        const selectedComments = comments.slice(0, amount);

        for (const comment of selectedComments) {
            //console.log(comment.toJSON());
        }

        const responseObject = commentsToResponse(selectedComments);

        await t.commit();
        response.status(200).json(responseObject);
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

const createNewComment = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const token = request.headers.authorization;
        const userInfo = await getUserInfo(token);

        const authorSub = userInfo.sub;
        const author = request.body.anonymity ? "" : userInfo.nickname;

        const requestBody = request.body;

        const newComment = await Comment.create({
            commentText: requestBody.commentText,
            commentAuthor: author,
            commentAuthorSub: authorSub,
            commentSentiment: requestBody.sentiment,
            commentSecondarySubject: requestBody.commentSecondarySubject,
            commentAnonymity: requestBody.anonymity
        },
        {transaction: t});

        const subjectComponentMeta = await ComponentMeta.findOne({
            where: {
                componentName: requestBody.commentSubject
            }
        },
        {transaction: t});

        await newComment.setSubject(subjectComponentMeta, {transaction: t});

        await t.commit();
        response.status(200).send("Success!");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
}


module.exports = {
    getCommentsFromParams,
    createNewComment
}