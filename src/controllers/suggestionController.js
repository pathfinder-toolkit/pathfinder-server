const db = require('../models');
const { Suggestion, ComponentMeta, SuggestionCondition, Area } = require('../models');

const sequelize = db.sequelize;

const { Op } = require("sequelize");

const {
    makeExampleSuggestions
} = require('./suggestionUtils/suggestionCreation');

const {
    filterSuggestion
} = require("./suggestionUtils/suggestionFilter");


const {
    suggestionsToResponse
} = require('../utils/JSONformatter');

const findSuggestionsFromParams = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const subject = request.params.subject;
        const value = request.params.value;
        const area = request.query.area;

        console.log("area " + area);

        //await makeExampleSuggestions( t );

        const suggestions = await Suggestion.findAll({
            attributes: ['suggestionText', 'suggestionSecondarySubject', 'priority', 'idSuggestion'],
            include: [{
                model: ComponentMeta,
                as : 'subject',
                where: {
                    componentName : subject
                },
                attributes:['subject','componentValueType']
            },{
                model: SuggestionCondition,
                as: 'conditions'
            },{
                model: Area,
                as: 'areas',
                where: {
                    idArea: area
                },
                attributes: []
            }]
        },
        {transaction: t});

        const filteredSuggestions = suggestions.filter(suggestion => filterSuggestion(suggestion, value))

        const responseObject = suggestionsToResponse(filteredSuggestions);
        
        await t.commit();
        response.status(200).json(responseObject);
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