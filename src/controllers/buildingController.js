const db = require('../models');
const { Component, Building, Category, ComponentValue, ComponentMeta} = require('../models');
const { makeComponent, makeMetaComponents, postTestBuilding } = require('./buildingUtils/buildingCreation');

const { BuildingJSONtoResponse } = require('../utils/JSONformatter');


const getSampleBuilding = async (request, response) => {

    //await makeMetaComponents();

    //await postTestBuilding();

    try {
        const buildingInDatabase = await Building.findOne({
            attributes:  ['slug'],
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

        console.log(JSON.stringify(buildingInDatabase, null, 4));

        const buildingJSON = buildingInDatabase.toJSON();

        const responseObject = BuildingJSONtoResponse(buildingJSON);

        response.status(200).json(responseObject);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        response.status(500).send("Internal server error");
    }
};

module.exports = {
    getSampleBuilding
}