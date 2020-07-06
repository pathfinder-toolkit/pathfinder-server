const db = require('../models');

const sequelize = db.sequelize;

const {
    makeExampleSuggestions
} = require('./suggestionUtils/suggestionCreation');

const findSuggestionsFromParams = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const subject = request.params.subject;
        const value = request.params.value;
        //await makeExampleSuggestions( t );

        
        console.log("rollback for safety");
        await t.rollback();
        response.status(200).send("Success: " + subject + " " + value);
    } catch (error) {
        console.log("rollback because of error");
        await t.rollback();
        console.log(error)
        response.status(500).send("Internal server error");
    }
}


module.exports = {
    findSuggestionsFromParams
};