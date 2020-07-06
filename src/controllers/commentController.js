const db = require('../models');

const sequelize = db.sequelize;

const {
    makeExampleComments
} = require('./commentUtils/commentCreation'); 

const getCommentsFromParams = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const subject = request.params.subject;

        await makeExampleComments(t);

        console.log("rollback for safety");
        await t.rollback();
        response.status(200).send("Subject " + subject);
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
}


module.exports = {
    getCommentsFromParams
}