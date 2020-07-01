const db = require('../models');
const { Building, Category, ComponentValue, ComponentMeta} = require('../models');
const { makeComponent, makeMetaComponents, postTestBuilding } = require('./buildingUtils/buildingCreation');

const sequelize = db.sequelize;
const Component = db.Component;


const getSampleBuilding = async (request, response) => {

    //await makeMetaComponents();

    //await postTestBuilding();

    console.log("Test")
};

module.exports = {
    getSampleBuilding
}