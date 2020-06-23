const db = require('../models');

const getAreas = async (request, response) => {
  try {
    db.sequelize.sync();
    console.log(entities);
    const areaObjects = await db.Area.findAll({
      attributes:  ['areaName']
    });
    console.log(areaObjects);

    let areas = [];
    areaObjects.forEach((areaObject) => {
      areas.push(areaObject.dataValues.areaName)
    });

    response.status(200).json(areas);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const getOptions = async (request, response) => {
  /*const client = await pool.connect();
  try {
    const area = request.params.area;
    let query = 'SELECT public."Areas"."idArea" FROM public."Areas" WHERE public."Areas"."areaName"=\'' + area + '\';'
    const resultAreaId = await client.query(query);
    const areaId = resultAreaId.rows[0].idArea;

    query = 'SELECT public."Materials"."materialValue" FROM public."Materials" WHERE public."Materials"."idArea"=' + areaId;
    const resultMaterialValues = await client.query(query);
    let materials = [];
    resultMaterialValues.rows.forEach((row) => {
      materials.push(row.materialValue);
    })

    response.status(200).json(materials);
  } catch(e) {
    console.error(e.message, e.stack)
  } finally {
    client.release()
  }*/
};

module.exports = {
  getAreas,
  getOptions
};