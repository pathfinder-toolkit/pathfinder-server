const db = require('../models');

const sequelize = db.sequelize;

const {
    makeExampleSuggestions
} = require('./suggestionUtils/suggestionCreation');
const { Suggestion, ComponentMeta } = require('../models');

const findSuggestionsFromParams = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const subject = request.params.subject;
        const value = request.params.value;
        //await makeExampleSuggestions( t );

        

        const suggestions = await Suggestion.findAll({
            attributes: ['suggestionText', 'suggestionSecondarySubject', 'priority', 'idSuggestion'],
            include: {
                model: ComponentMeta,
                as : 'subject',
                where: {
                    componentName : subject
                },
                attributes:['subject']
            }
        });

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        shuffleArray(suggestions);

        let amount = Math.min( Math.abs(value), suggestions.length );
        
        const selectedSuggestions = suggestions.slice(0, amount);

        for (const suggestion of selectedSuggestions) {
            console.log(suggestion.toJSON());
        }

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