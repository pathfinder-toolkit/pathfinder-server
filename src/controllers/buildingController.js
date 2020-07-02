const db = require('../models');
const { Component, Building, Category, ComponentValue, ComponentMeta} = require('../models');
const { makeComponent, makeMetaComponents, postTestBuilding, makeComponentWithTransaction, checkSlug} = require('./buildingUtils/buildingCreation');
const slugify = require("slugify");

const sequelize = db.sequelize;

const requestBody = require('../json/postRequestExample.json');

const { BuildingJSONtoResponse } = require('../utils/JSONformatter');
const { response } = require('express');


const getSampleBuilding = async (request, response) => {

    //await makeMetaComponents();

    //await postTestBuilding();

    try {
        const buildingInDatabase = await Building.findOne({
            attributes: ['slug'],
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
                        attributes: ['valueString', 'valueDate', 'valueInt', 'valueDouble', 'valueText']
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
        //console.log(JSON.stringify(requestBody, null, 4));

        const author = request.user.sub;
        console.log(author);
        /*const slug = slugify(requestBody.details.name.value, {lower: true});

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
                const componentName = property;
                const value = Array.isArray(requestBody[category][property]) ? 
                    (requestBody[category][property][0].value) : 
                    (requestBody[category][property].value);
                const isCurrent = true;
    
                console.log(componentName, value, isCurrent);
    
                const component = await makeComponentWithTransaction(componentName, value, isCurrent, t);
                components.push(component);
            }
            await currentCategory.addComponents(components, {transaction: t});
            categories.push(currentCategory);
        }
        await building.addCategories(categories, { transaction: t });

        console.log(building.toJSON());*/

        console.log("success, but rollback anyway");

        await t.rollback();
        response.status(200).send("Success!");
    } catch (error) {
        await t.rollback();
        console.log(error);
    }
    
}

module.exports = {
    getSampleBuilding,
    postBuildingFromData
}