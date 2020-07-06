const db = require('../models');
const { ComponentMeta, Suggestion } = require('../models');

const sequelize = db.sequelize;

const findSuggestionsFromParams = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const subject = request.params.subject;
        const value = request.params.value;
        const allSubjects = await ComponentMeta.findAll({
            where: {
                'hasSuggestions': 'true'
            },
            attributes: ['subject']
        });
        allSubjects.map((subject) => {
            console.log(subject.toJSON());
            /*const suggestion1 = Suggestion.build({
                suggestionText: '',
                suggestionCondition: null,
                suggestionSecondarySubject: null
            });*/
            
        })
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