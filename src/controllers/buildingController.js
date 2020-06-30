const db = require('../models');
const { Building, Category, ComponentValue, ComponentMeta} = require('../models');
const { makeNameComponent } = require('./buildingUtils/buildingCreation');

const sequelize = db.sequelize;
const Component = db.Component;


const postBuildingTest = async (request, response) => {
    const nameComponent = await makeNameComponent("No name");

    console.log(JSON.stringify(nameComponent, null, 4));

    /*const subject = await Subject.create({
        subjectText: "No subject"
    });*/

    /*const building = await Building.create({
        buildingAuthorSub: 'noauthor',
        slug: 'exampleslug'
    })

    detailsCategory = await Category.create({
        categoryName: 'details',
    })

    await building.addCategory(detailsCategory);

    console.log(JSON.stringify(building, null, 4));*/

    /*const buildingObject = {
        buildingAuthorSub: 'noauthor|1',
        slug: 'examplebuilding',
        categories: []
    };

    const detailsCategory = makeCategory('details');

    detailsCategory.addComponent(makeNameComponent('Example name'));
    buildingObject.categories.push(detailsCategory);

    console.log(JSON.stringify(buildingObject, null, 4));

    const newBuilding = Building.build(
        buildingObject, 
        {
            include: {
                model: Category,
                as: 'categories',
                include: [{
                    model: Component,
                    as: 'components',
                    include: [{
                        model: Subject,
                        as: 'subject'
                    },{
                        model: ComponentValue,
                        as: 'value'
                    }]
                }]
            }
        });

    

    console.log(JSON.stringify(newBuilding, null, 4));

    newBuilding.save();*/
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