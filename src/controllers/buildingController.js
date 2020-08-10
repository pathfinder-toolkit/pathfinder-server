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
const { response } = require('express');


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
                        const usageStartYear = componentInArray.usageStartYear;

                        console.log("Component in array:");
                        console.log(componentName, value, isCurrent);
                        const component = await makeComponentWithTransaction(componentName, value, isCurrent, t, usageStartYear);
                        components.push(component);
                    }
                } else {
                    const componentName = property;
                    const value = Array.isArray(requestBody[category][property]) ? 
                        (requestBody[category][property][0].value) : 
                        (requestBody[category][property].value);
                    const isCurrent = requestBody[category][property].isCurrent
                    const usageStartYear = requestBody[category][property].usageStartYear;
                    console.log(componentName, value, isCurrent);
    
                    const component = await makeComponentWithTransaction(componentName, value, isCurrent, t, usageStartYear);
                    components.push(component);
                }
                
            }
            await currentCategory.addComponents(components, {transaction: t});
            categories.push(currentCategory);
        }
        await building.addCategories(categories, { transaction: t });

        console.log(building.toJSON());

        await t.commit();
        response.status(201).json({
            slug: verifiedSlug
        });
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
            attributes:['slug', ['buildingAuthorSub', 'author'], 'publicStatus'],
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
                const responseObject = FullBuildingJSONtoResponse(filteredBuildingJSON);
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

const checkOwnerStatus = async (request, response, next) => {
    try {
        const slug = request.params.slug;
        const author = request.user.sub;
        const building = await Building.findOne({
            where: {
                'slug': slug
            },
            attributes: ['buildingAuthorSub']
        });
        author === building.buildingAuthorSub ? next() : (() => {throw new Error("Insufficient permissions")})();
    } catch (error) {
        console.log(error);
        response.status(403).send(error.message);
    }
}

const checkOwnerOrAdminStatus = async (request, response, next) => {
    try {
        console.log(request.user);
        if (request.user["https://pathfinder-toolkit.herokuapp.com/roles"].includes("Admin")) {
            next();
        } else {
            const slug = request.params.slug;
            const author = request.user.sub;
            const building = await Building.findOne({
                where: {
                    'slug': slug
                },
                attributes: ['buildingAuthorSub']
            });
            author === building.buildingAuthorSub ? next() : (() => {throw new Error("Insufficient permissions")})();
        }
    } catch(error) {
        console.log(error);
        response.status(403).send(error.message);
    }
}

const updateBuildingData = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const slug = request.params.slug;
        const updateData = request.body;
        const building = await Building.findOne({
            where:{
                'slug': slug
            },
            attributes:['idBuilding'],
            include: {
                model: Category,
                as: 'categories',
                attributes: ['idCategory','categoryName'],
                include: {
                    model: Component,
                    as: 'components',
                    attributes: ['idComponent','isCurrent', 'usageStartYear'],
                    include: [{
                        model: ComponentMeta,
                        as: 'meta',
                        attributes: ['idMeta','componentName', 'hasSuggestions', 'componentValueType'],
                    },{
                        model: ComponentValue,
                        as: 'value',
                        attributes: ['id','valueString', 'valueDate', 'valueInt', 'valueDouble', 'valueText', 'valueBoolean']
                    }]
                }
            }
        },
        { transaction: t });
        const componentIdsToDestroy = [];
        for (const category of building.categories) {
            
            for (const component of category.components) {
                if (!component.meta.hasSuggestions) {
                    switch (component.meta.componentValueType) {
                        case 'string':
                            component.value.valueString = updateData[category.categoryName][component.meta.componentName].value;
                            break;
                        case 'date':
                            component.value.valueDate = updateData[category.categoryName][component.meta.componentName].value;
                            break;
                        case 'int':
                            component.value.valueInt = updateData[category.categoryName][component.meta.componentName].value;
                            break;
                        case 'double':
                            component.value.valueDouble = updateData[category.categoryName][component.meta.componentName].value;
                            break;
                        case 'boolean':
                            component.value.valueBoolean = updateData[category.categoryName][component.meta.componentName].value;
                            break;
                        case 'text':
                            component.value.valueText = updateData[category.categoryName][component.meta.componentName].value;
                            break;
                        default:
                            break;
                    }
                    component.isCurrent = updateData[category.categoryName][component.meta.componentName].isCurrent;
                    await component.save({transaction: t});
                    await component.value.save({transaction: t});
                } else {
                    componentIdsToDestroy.push(component.idComponent);
                }
            }
            // Create new components for ones where the components are stored in an array (hasSuggestions == true)
            const createdComponents = [];
            for (const newComponentData of Object.entries(updateData[category.categoryName])) {
                if (newComponentData.some(entry => Array.isArray(entry))) {
                    const componentName = newComponentData[0];
                    for (const singleNewComponentData of newComponentData[1]) {
                        const value = singleNewComponentData.value;
                        const isCurrent = singleNewComponentData.isCurrent;
                        const usageStartYear = singleNewComponentData.usageStartYear;
                        const component = await makeComponentWithTransaction(componentName, value, isCurrent, t, usageStartYear);
                        createdComponents.push(component);
                        console.log(component.toJSON());
                    }
                }
            }
            console.log(category.toJSON());
            if (createdComponents.length > 0) {
                await category.addComponents(createdComponents, {transaction: t});
            }
        }

        await Component.destroy(
            {
                where: 
                {
                    idComponent: 
                    {
                        [Op.or]: componentIdsToDestroy
                    }
                },
                transaction: t
            }
        );

        await t.commit();
        response.status(200).send("Updated");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

const deleteBuilding = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const slug = request.params.slug;

        const building = await Building.findOne({
            where: {
                slug: slug
            }
        });

        if (!building) {
            throw new Error("No building found");
        }

        await building.destroy({transaction: t});
        
        await t.commit();
        response.status(200).send("Deleted");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const updateBuildingPublicityStatus = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const slug = request.params.slug;
        const newStatus = request.body.publicStatus;

        const building = await Building.findOne({
            where: {
                slug: slug
            },
            attributes: ['idBuilding', 'publicStatus']
        });

        !building && (() => {throw new Error("No building found")})();

        building.publicStatus = newStatus;
        await building.save({transaction: t});

        await t.commit();

        response.status(200).send("Publicity status updated");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const checkPublicStatus = async (request, response, next) => {
    try {
        const slug = request.params.slug;
        const building = await Building.findOne({
            where: {
                slug: slug
            },
            attributes: ['publicStatus']
        });

        !building && (() => {throw new Error("No building exists in database")})();

        !building.publicStatus && (() => {throw new Error("Building is private")})();

        next();
    } catch (error) {
        console.log(error);
        response.status(404).send("Cannot find building");
    }
}

const getPublicBuilding = async (request, response) => {
    try {
        const slug = request.params.slug;
        const building = await Building.findOne({
            attributes:['slug', 'publicStatus'],
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
            },
        });

        const buildingJSON = building.toJSON();

        const filteredBuildingJSON = filterBuildingObject(buildingJSON);

        const responseObject = FullBuildingJSONtoResponse(filteredBuildingJSON);

        response.status(200).json(responseObject);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

module.exports = {
    getSampleBuilding,
    postBuildingFromData,
    getBuildingsForUser,
    getFullBuildingDetailsFromSlug,
    checkOwnerStatus,
    checkOwnerOrAdminStatus,
    updateBuildingData,
    deleteBuilding,
    updateBuildingPublicityStatus,
    checkPublicStatus,
    getPublicBuilding
}