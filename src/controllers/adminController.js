const db = require('../models');
const FeedbackRecipient = db.FeedbackRecipient;
const ComponentMeta = db.ComponentMeta;
const Area = db.Area;
const AreaComponent = db.AreaComponent;
const AreaOption = db.AreaOption;
const Suggestion = db.Suggestion;
const SuggestionCondition = db.SuggestionCondition;
const Comment = db.Comment;

const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { CommentReport } = require('../models');

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
                as: "components",
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
            for (const identifier of formattedArea.components) {
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

        const conditions = [];
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

            console.log(newCondition.toJSON());

            conditions.push(newCondition);
        }
        await newSuggestion.addConditions(conditions, {transaction: t});

        const areas = [];
        for (const area of suggestionData.areas) {
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
        await newSuggestion.addAreas(areas, {transaction: t});

        console.log(newSuggestion.toJSON());

        await t.commit();
        response.status(201).send("Created");
    } catch(error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const getAllSuggestionsFromIdentifier = async (request, response) => {
    try {
        const identifier = request.params.identifier;
        const meta = await ComponentMeta.findOne({
            where: {
                componentName: identifier
            },
            attributes: ['idMeta','componentName','subject','componentValueType']
        });
        const suggestions = await Suggestion.findAll({
            where: {
                idMeta: meta.idMeta
            },
            attributes: ['idSuggestion', ['suggestionText','suggestion'],'priority'],
            include: [{
                model: SuggestionCondition,
                as: 'conditions',
                attributes: ['condition','idMeta'],
            },{
                model: Area,
                through: {
                    attributes: []
                },
                as: 'areas',
                attributes: ['idArea','areaName']
            }]
        })
        for (const suggestion of suggestions) {
            console.log(JSON.stringify(suggestion, false, 4))
        }
        let formattedSuggestions = [];
        for (const suggestion of suggestions) {
            const formattedSuggestion = {
                ...suggestion.toJSON(),
                identifier: meta.componentName,
                subject: meta.subject,
                valueType: meta.componentValueType
            }
            let formattedConditions = [];
            for (const condition of formattedSuggestion.conditions) {
                const conditionMeta = await ComponentMeta.findOne({
                    where: {
                        idMeta: condition.idMeta
                    },
                    attributes: ['componentName', 'componentValueType','subject']
                });
                let formattedCondition = {
                    ...condition,
                    conditionedBy: conditionMeta.componentName,
                    valueType: conditionMeta.componentValueType,
                    subject: conditionMeta.subject
                };
                delete formattedCondition.idMeta;
                formattedConditions = [...formattedConditions, formattedCondition]
            }
            formattedSuggestion.conditions = formattedConditions;
            formattedSuggestions = [...formattedSuggestions, formattedSuggestion]
        }
        response.status(200).json(formattedSuggestions);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

const updateExistingSuggestion = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const id = request.params.id;
        const suggestionData = request.body;

        console.log(suggestionData);

        const suggestion = await Suggestion.findOne({
            where: {
                idSuggestion: id
            },
            include: [{
                model: SuggestionCondition,
                as: 'conditions'
            },{
                model: Area,
                as: 'areas'
            }
            ]
        },
        {transaction: t})

        const suggestionMeta = await ComponentMeta.findOne({
            where: {
                componentName: suggestionData.identifier
            },
            attributes: ['idMeta', 'componentName','componentValueType']
        },
        {transaction: t});

        if (!suggestion) {
            throw new Error("Invalid id in query");
        }

        suggestion.suggestionText = suggestionData.suggestion;
        suggestion.priority = suggestionData.priority;

        await suggestion.save({transaction: t});
        await suggestion.setSubject(suggestionMeta, {transaction: t});

        for (const condition of suggestion.conditions) {
            await condition.destroy({transaction: t});
        }

        await suggestion.removeAreas(suggestion.areas, {transaction: t});

        const conditions = [];
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
            suggestion.suggestionSecondarySubject = null;
            if (suggestionMeta.componentValueType === 'string' && suggestionMeta.componentName === conditionMeta.componentName) {
                if (condition.condition.split(',').length === 1) {
                    suggestion.suggestionSecondarySubject = condition.condition;
                }
            }
            await suggestion.save({ transaction: t});

            await newCondition.setConditionedBy(conditionMeta, {transaction: t});

            conditions.push(newCondition);
        }
        await suggestion.addConditions(conditions, {transaction: t});

        const areas = [];
        for (const area of suggestionData.areas) {
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
        await suggestion.addAreas(areas, {transaction: t});

        await t.commit();
        response.status(200).send("OK!");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const deleteExistingSuggestion = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const id = request.params.id;

        const suggestion = await Suggestion.findOne({
            where: {
                idSuggestion: id
            },
            include: {
                model: SuggestionCondition,
                as: 'conditions'
            }
        },
        {transaction: t})

        if (!suggestion) {
            throw new Error("Invalid id in query");
        }

        for (const condition of suggestion.conditions) {
            await condition.destroy({transaction: t});
        }

        await suggestion.destroy({transaction: t});

        await t.commit();
        response.status(200).send("Deleted");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const updateOptionsOnIdentifier = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const identifier = request.params.identifier;
        const areaIds = request.query.areas.split(',').map(Number);
        const newOptionData = request.body;

        const currentOptions = await AreaOption.findAll({
            attributes: ['idOption'],
            include: {
                model: AreaComponent,
                as: 'identifier',
                where: {
                    identifier: identifier
                },
                attributes: [],
                include: {
                    model: Area,
                    as: 'area',
                    where: {
                        idArea: {
                            [Op.or]: areaIds
                        }
                    },
                    attributes: []
                }
            }
        },
        {transaction: t});

        const currentOptionIds = currentOptions.map(option => option.idOption);
        console.log(currentOptionIds);

        if (currentOptionIds.length > 0) {
            await AreaOption.destroy(
                {
                    where: 
                    {
                        idOption: 
                        {
                            [Op.or]: currentOptionIds
                        }
                    },
                    transaction: t
                }
            );
        }

        

        const components = await AreaComponent.findAll({
            where: {
                identifier: identifier
            },
            include: {
                model: Area,
                as: 'area',
                where: {
                    idArea: {
                        [Op.or]: areaIds
                    }
                }
            }
        },
        {transaction: t});

        for (const component of components) {
            let options = [];
            for (const newOption of newOptionData) {
                const option = await AreaOption.create({
                    option: newOption.option
                },
                {transaction: t});
                console.log(option.toJSON());
                options.push(option);
            }
            await component.addOptions(options, {transaction: t});
            console.log(component.toJSON());
        }

        await t.commit();
        response.status(200).send("Updated");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const deleteSelectedComment = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const idComment = Number(request.params.id);

        const comment = await Comment.findOne({
            where: {
                idComment: idComment
            }
        },
        {transaction: t});

        !comment && (() => {throw new Error("Comment not found")})();

        console.log(comment.toJSON());

        await comment.destroy({transaction: t});

        await t.commit();

        response.status(200).send("Deleted");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const getCurrentAmountOfReports = async (request, response) => {
    try {
        const amount = {
            amount: await CommentReport.count()
        };

        response.status(200).json(amount);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

const getCurrentReports = async (request, response) => {
    try {
        const page = parseInt(request.query.page);
        console.log(`page: ${page}`);
        const perPage = parseInt(request.query.perPage);
        console.log(`perPage: ${perPage}`);

        const { count, rows } = await CommentReport.findAndCountAll({
            attributes: ['idReport', 'reason', 'reportedBy'],
            include: {
                model: Comment,
                as: 'comment',
                attributes: [
                    'idComment', 'commentText', 'commentSecondarySubject',
                    ['createdAt', 'date'],['commentAuthor','author'],['commentSentiment', 'sentiment']
                ],
                include: {
                    model: ComponentMeta,
                    as: 'subject',
                    attributes: ['subject']
                },
            },
            limit: perPage,
            offset: (page - 1) * perPage
        });

        let formattedReports = [];

        for (const row of rows) {
            const jsonRow = row.toJSON();
            jsonRow.comment.subject = jsonRow.comment.subject.subject;
            formattedReports = [...formattedReports, jsonRow];
        }

        const pages = Math.ceil(count / perPage);

        console.log(`Pages: ${pages}`);

        const responseObject = {
            page: page,
            maxPages: pages,
            reports: formattedReports
        };

        response.status(200).json(responseObject);
    } catch (error) {
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
    postNewSuggestion,
    getAllSuggestionsFromIdentifier,
    updateExistingSuggestion,
    deleteExistingSuggestion,
    updateOptionsOnIdentifier,
    deleteSelectedComment,
    getCurrentAmountOfReports,
    getCurrentReports
}