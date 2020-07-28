const db = require('../models');
const { Comment, ComponentMeta, CommentReport } = require('../models');

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

        const page = parseInt(request.query.page);
        console.log(`page: ${page}`);
        const perPage = parseInt(request.query.perPage);
        console.log(`perPage: ${perPage}`);

        const { count, rows } = await Comment.findAndCountAll({
            include: {
                model: ComponentMeta,
                as: 'subject',
                where: {
                    componentName: subject
                },
                attributes: ['subject']
            },
            order:[
                ['createdAt','DESC']
            ],
            limit: perPage,
            offset: (page - 1) * perPage
        },
        {transaction: t});

        const pages = Math.ceil(count / perPage);

        console.log(`Pages: ${pages}`);

        const responseObject = commentsToResponse(rows, page, pages);

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
        response.status(201).send("Created");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

const submitReportOnComment = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const idComment = Number(request.params.id);
        const reason = request.body.reason;
        const reporter = request.user.sub;

        const comment = await Comment.findOne({
            where: {
                idComment: idComment
            }
        },
        {transaction: t});

        !comment && (() => {throw new Error("Comment not found")})();

        const report = await CommentReport.create({
            reportedBy: reporter,
            reason: reason
        },
        {transaction: t});
        
        await report.setComment(comment, {transaction: t});

        console.log(report.toJSON());

        await t.commit();
        response.status(201).send("Reported!");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

module.exports = {
    getCommentsFromParams,
    createNewComment,
    submitReportOnComment
}