const db = require('../models');

const findSuggestionsFromParams = async (request, response) => {
    try {
        const subject = request.params.subject;
        const value = request.params.value;
        response.status(200).send("Success: " + subject + " " + value);
    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error");
    }
}


module.exports = {
    findSuggestionsFromParams
};