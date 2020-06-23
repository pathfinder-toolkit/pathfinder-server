const db = require('../models');

const sequelize = db.sequelize;
const Area = db.Area;

const getAreas = async (request, response) => {
    try {
      sequelize.sync();
      const areaObjects = await Area.findAll({
        attributes:  ['areaName']
      });
  
      let areas = [];
      areaObjects.forEach((areaObject) => {
        areas.push(areaObject.dataValues.areaName)
      });
  
      response.status(200).json(areas);
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };

module.exports = {
    getAreas
}