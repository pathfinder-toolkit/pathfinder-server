const db = require('../models');
const { Component, Building, Category, ComponentValue, ComponentMeta, Suggestion, SuggestionCondition, Area } = require('../models');
const { makeComponent, makeMetaComponents, postTestBuilding, makeComponentWithTransaction, checkSlug} = require('./buildingUtils/buildingCreation');
const slugify = require("slugify");

const sequelize = db.sequelize;
const { Op } = require("sequelize");

const {
    filterBuildingObject
} = require("./suggestionUtils/suggestionFilter");

const { 
    BuildingJSONtoResponse,
    FullBuildingJSONtoResponse,
    userBuildingListToResponse,
    suggestionsToResponse
} = require('../utils/JSONformatter');


const getSampleBuilding = async (request, response) => {

    //await makeMetaComponents();

    //await postTestBuilding();

    try {
        const buildingInDatabase = await Building.findOne({
            attributes: [],
            where: {
                buildingAuthorSub: 'noauthor'
            },
            include: {
                model: Category,
                as: 'categories',
                attributes: ['categoryName'],
                include: {
                    model: Component,
                    through: {
                        attributes: []
                    },
                    as: 'components',
                    attributes: ['isCurrent','usageStartYear'],
                    include: [{
                        model: ComponentMeta,
                        as: 'meta',
                        attributes: ['componentDescription','componentName','hasSuggestions','subject']
                    },{
                        model: ComponentValue,
                        as: 'value',
                        attributes: ['valueString', 'valueDate', 'valueInt', 'valueDouble', 'valueText', 'valueBoolean']
                    }]
                }
            }
        });

        const buildingJSON = buildingInDatabase.toJSON();

        const responseObject = BuildingJSONtoResponse(buildingJSON);

        response.status(200).json(responseObject);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        response.status(500).send("Internal server error");
    }
};

const postBuildingFromData = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const author = request.user.sub;
        console.log(author);

        const requestBody = request.body;

        console.log(JSON.stringify(requestBody, null, 4));
        if (!requestBody.details.name.value) {
            throw new Error("Invalid building name");
        }
        const slug = slugify(requestBody.details.name.value, {lower: true});

        const verifiedSlug = await checkSlug(slug);

        const building = await Building.create({
            buildingAuthorSub: author,
            slug: verifiedSlug
        },
        { transaction: t})

        console.log(building.toJSON());

        categories = [];
        for (category in requestBody) {
            const currentCategory = await Category.create({
                categoryName: category
            },
            { transaction: t})
            console.log(currentCategory.toJSON());
            const components = [];
            for (property in requestBody[category]) {
                if (Array.isArray(requestBody[category][property])) {
                    for (const componentInArray of requestBody[category][property]) {
                        const componentName = property;
                        const value = componentInArray.value;
                        const isCurrent = componentInArray.isCurrent;

                        console.log("Component in array:");
                        console.log(componentName, value, isCurrent);
                        const component = await makeComponentWithTransaction(componentName, value, isCurrent, t);
                        components.push(component);
                    }
                } else {
                    const componentName = property;
                    const value = Array.isArray(requestBody[category][property]) ? 
                        (requestBody[category][property][0].value) : 
                        (requestBody[category][property].value);
                    const isCurrent = requestBody[category][property].isCurrent
                    console.log(componentName, value, isCurrent);
    
                    const component = await makeComponentWithTransaction(componentName, value, isCurrent, t);
                    components.push(component);
                }
                
            }
            await currentCategory.addComponents(components, {transaction: t});
            categories.push(currentCategory);
        }
        await building.addCategories(categories, { transaction: t });

        console.log(building.toJSON());

        await t.commit();
        response.status(201).send("Created");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
    
}

const getBuildingsForUser = async (request, response) => {
    try {
        const author = request.user.sub;

        const buildings = await Building.findAll({
            attributes: ["slug",["updatedAt","creationDate"]],
            where: {
                'buildingAuthorSub': author
            },
            include: {
                model: Category,
                as: 'categories',
                attributes:['idCategory'],
                where: {
                    'categoryName': 'details'
                },
                include: {
                    model: Component,
                    through: {
                        attributes: []
                    },
                    as: 'components',
                    attributes:['idMeta'],
                    where: {
                        'idMeta': {
                            [Op.or] : [1, 6]
                        }
                    },
                    include: [{
                        model: ComponentValue,
                        as: 'value',
                        attributes:[['valueString','value']]
                    },
                    {
                        model: ComponentMeta,
                        as: 'meta',
                        attributes: ['componentName']
                    }]
                }
            }
        });

        const responseList = userBuildingListToResponse(buildings);

        response.status(200).json(responseList);
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

const getFullBuildingDetailsFromSlug = async (request, response) => {
    
    try {
        const slug = request.params.slug;
        const building = await Building.findOne({
            attributes:['slug', ['buildingAuthorSub', 'author']],
            where:{
                'slug': slug
            },
            include: {
                model: Category,
                as: 'categories',
                attributes: ['categoryName'],
                include: {
                    model: Component,
                    through: {
                        attributes: []
                    },
                    as: 'components',
                    attributes: ['isCurrent', 'usageStartYear'],
                    include: [{
                        model: ComponentMeta,
                        as: 'meta',
                        attributes: ['idMeta','componentDescription', 'componentName', 'hasSuggestions', 'subject', 'componentValueType'],
                        include: [{
                            model: Suggestion,
                            as: 'suggestions',
                            include: [{
                                model: ComponentMeta,
                                as: 'subject',
                                attributes: ['subject']
                            },{
                                model: SuggestionCondition,
                                as: 'conditions'
                            },{
                                model: Area,
                                through: {
                                    attributes: []
                                },
                                as: 'areas'
                            }]
                        }]
                    },{
                        model: ComponentValue,
                        as: 'value',
                        attributes: ['valueString', 'valueDate', 'valueInt', 'valueDouble', 'valueText', 'valueBoolean']
                    }]
                }
            }
        });

        //console.log(JSON.stringify(building, null, 4));

        if (building) {
            const buildingJSON = building.toJSON();

            const filteredBuildingJSON = filterBuildingObject(buildingJSON);

            const author = request.user.sub;

            if (author == buildingJSON.author) {
                const responseObject = FullBuildingJSONtoResponse(buildingJSON);
                response.status(200).json(responseObject);
            } 
            else {
                response.status(403).send("403 Forbidden");
            }
        } 
        else {
            response.status(404).send("404 No data found.");
        }

    } catch (error) {
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

module.exports = {
    getSampleBuilding,
    postBuildingFromData,
    getBuildingsForUser,
    getFullBuildingDetailsFromSlug
}