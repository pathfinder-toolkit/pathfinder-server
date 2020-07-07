const db = require('../models');
const { Comment, ComponentMeta } = require('../models');

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


module.exports = {
    getCommentsFromParams
}