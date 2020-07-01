const db = require('../models');
const { Building, Category, ComponentValue, ComponentMeta} = require('../models');
const { makeComponent, makeMetaComponents, postTestBuilding } = require('./buildingUtils/buildingCreation');

const sequelize = db.sequelize;
const Component = db.Component;


const getSampleBuilding = async (request, response) => {

    //await makeMetaComponents();

    //await postTestBuilding();

    console.log("Test")

    try {
        const buildingInDatabase = await Building.findOne({
            attributes:  [['buildingAuthorSub','author'],'slug'],
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

        const buildingObject = {};
        buildingObject.author = buildingJSON.author;
        buildingObject.slug = buildingJSON.slug;

        buildingJSON['categories'].map((category, index) => {
            const currentCategory = {};
            
            category.components.map((component, index) => {
                console.log(component);
                const currentComponent = {};
                currentComponent.componentDescription = component.meta.componentDescription;
                let value;
                currentComponent.hasSuggestions = component.meta.hasSuggestions;
                currentComponent.isCurrent = component.isCurrent;
                currentComponent.usageStartYear = component.usageStartYear;
                currentCategory[component.meta.componentName] = currentComponent.hasSuggestions ? [(currentComponent)] : (currentComponent);
            });
            buildingObject[category.categoryName] = currentCategory;
        });


        console.log(JSON.stringify(buildingObject, null, 4));

        response.status(200).json(buildingObject);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        response.status(500).send("Internal server error");
    }
};

module.exports = {
    getSampleBuilding
}