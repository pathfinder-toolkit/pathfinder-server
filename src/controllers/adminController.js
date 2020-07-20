const db = require('../models');
const FeedbackRecipient = db.FeedbackRecipient;
const ComponentMeta = db.ComponentMeta;
const Area = db.Area;
const AreaComponent = db.AreaComponent;
const AreaOption = db.AreaOption;
const Suggestion = db.Suggestion;
const SuggestionCondition = db.SuggestionCondition;

const sequelize = db.sequelize;
const { Op } = require("sequelize");

const checkAdminStatus = async (request, response, next) => {
    try {
        console.log(request.user);
        if (request.user["https://pathfinder-toolkit.herokuapp.com/roles"].includes("Admin")) {
            next();
        } else {
            response.status(401).send("Unauthorized");
        }
    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error");
    }
}

const confirmAdminStatus = async (request, response) => {
    response.status(200).send("Verified");
};

const getFeedbackRecipients = async (request, response) => {
    try {
        const recipients = await FeedbackRecipient.findAll({
            attributes: [['eMail','email']]
        });
        response.status(200).json(recipients);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

const updateFeedbackRecipients = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const recipients = await FeedbackRecipient.findAll({
        });

        for (const recipient of recipients) {
            await recipient.destroy({transaction: t});
        }

        const author = request.user.sub;
        const newRecipients = request.body;

        for (const newRecipient of newRecipients) {
            const newRecipientObject = await FeedbackRecipient.create({
                eMail: newRecipient.email,
                setBy: author
            },
            {transaction: t});
            console.log(newRecipientObject.toJSON());
        }
        
        await t.commit();
        
        response.status(200).send("Updated!");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const getAvailableSuggestionSubjects = async (request, response) => {
    try {
        const subjects = await ComponentMeta.findAll({
            attributes: [["componentName","identifier"],["componentValueType","valueType"],"subject"],
            where: {
                hasSuggestions: true
            }
        });

        response.status(200).send(subjects);
    } catch(error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

const getSelectableOptionsFromParams = async (request, response) => {
    try {
        const identifier = request.params.identifier;
        const areaIds = request.query.areas.split(',').map(Number);

        const areas = await Area.findAll({
            attributes: ['idArea'],
            where: {
                idArea: {
                    [Op.or]: areaIds
                }
            },
            include: {
                model: AreaComponent,
                as: "identifiers",
                where: {
                    identifier: identifier
                },
                attributes:['identifier'],
                include: {
                    model: AreaOption,
                    as: "options",
                    attributes:['option']
                }
            }
        });

        const allOptions = [];

        for (const area of areas) {
            const formattedArea = area.toJSON();
            for (const identifier of formattedArea.identifiers) {
                for (const option of identifier.options) {
                    allOptions.push(option.option);
                }
            }
        }

        const uniqueOptions = [...new Set(allOptions)].sort();

        response.status(200).json(uniqueOptions);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

const postNewSuggestion = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        console.log(JSON.stringify(request.body, false, 4));
        const suggestionData = request.body;

        const newSuggestion = Suggestion.build({
            suggestionText: suggestionData.suggestion,
            priority: suggestionData.priority
        });
        const conditions = [];
        const suggestionMeta = await ComponentMeta.findOne({
            where: {
                componentName: suggestionData.identifier
            },
            attributes: ['idMeta', 'componentName','componentValueType']
        },
        {transaction: t});

        console.log(suggestionMeta.toJSON());

        await newSuggestion.save({transaction: t});
        await newSuggestion.setSubject(suggestionMeta, {transaction: t});
        for (const condition of suggestionData.conditions) {
            const newCondition = await SuggestionCondition.create({
                condition: condition.condition
            },
            {transaction: t});
            const conditionMeta = await ComponentMeta.findOne({
                where: {
                    componentName: condition.conditionedBy
                },
                attributes: ['idMeta', 'componentName']
            }, {transaction: t});

            // Set secondary subject only for values with predefined string options, if there is only one option in the condition
            if (suggestionMeta.componentValueType === 'string' && suggestionMeta.componentName === conditionMeta.componentName) {
                if (condition.condition.split(',').length === 1) {
                    newSuggestion.suggestionSecondarySubject = condition.condition;
                    await newSuggestion.save({ transaction: t});
                }
            }

            await newCondition.setConditionedBy(conditionMeta, {transaction: t});
            const areas = [];
            for (const area of condition.areas) {
                const areaObject = await Area.findOne({
                    where: {
                        idArea: area.id
                    },
                    attributes: ['idArea']
                },
                {transaction: t})
                console.log(areaObject.toJSON());
                areas.push(areaObject);
            }
            await newCondition.addAreas(areas, {transaction: t});

            console.log(newCondition.toJSON());

            conditions.push(newCondition);
        }
        await newSuggestion.addConditions(conditions, {transaction: t});

        console.log(newSuggestion.toJSON());

        await t.commit();
        response.status(201).send("Created");
    } catch(error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

module.exports = {
    checkAdminStatus,
    confirmAdminStatus,
    getFeedbackRecipients,
    updateFeedbackRecipients,
    getAvailableSuggestionSubjects,
    getSelectableOptionsFromParams,
    postNewSuggestion
}