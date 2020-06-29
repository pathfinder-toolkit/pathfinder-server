const db = require('../models');
const { Building, Category, ComponentValue, Subject } = require('../models');

const sequelize = db.sequelize;
const Component = db.Component;

const postBuildingTest = async (request, response) => {
    const newBuilding = Building.build({
        buildingAuthor: 'No author',
        slug: 'examplebuilding',
        categories: [{
            categoryName: 'details',
            components:[{
                componentName: 'Name',
                hasSuggestions: false,
                isCurrent: true,
                componentValueType: 'string',
                value: {
                    valueString: 'Example name'
                },
                subject: {
                    subjectText: 'Example subject'
                }
            }]
        }]
    }, {
        include: {
            model: Category,
            as: 'categories',
            include: [{
                model: Component,
                as: 'components',
                include: ['value', 'subject']
            }]
        }
    });

    console.log(JSON.stringify(newBuilding, null, 4));
};

/*const getAreas = async (request, response) => {
    try {
        const areas = await Area.findAll({
            attributes:  ['areaName']
        });

        response.status(200).json(areas);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        response.status(500).send("Internal server error");
    }
};*/

module.exports = {
    postBuildingTest
}