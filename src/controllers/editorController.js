const db = require('../models');
const { Material, RoofType, VentilationType, HeatingType, BuildingType } = require('../models');

const sequelize = db.sequelize;
const Area = db.Area;

const getAreas = async (request, response) => {
    try {
        const areas = await Area.findAll({
            attributes:  ['areaName']
        });

        response.status(200).json(areas);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        response.status(500).send("Internal server error");
    }
};

const getOptionsForArea = async (request, response) => {
    try {
        const selectedArea = await Area.findOne({
            attributes: [],
            where: {
              areaName: request.params.area
            },
            include: [{
                model: Material,
                as: 'materials',
                attributes: ['value']
            }, {
                model: RoofType,
                as: 'roofTypes',
                attributes: ['value']
            }, {
                model: VentilationType,
                as: 'ventilationTypes',
                attributes: ['value']
            }, {
                model: HeatingType,
                as: 'heatingTypes',
                attributes: ['value']
            }, {
                model: BuildingType,
                as: 'buildingTypes',
                attributes: ['value']
            }]
        });
        console.log(selectedArea.toJSON());

        response.status(200).json(selectedArea.toJSON());
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        response.status(500).send("Internal server error");
    }
}

/*const getOptions = async (request, response) => {
    const client = await pool.connect();
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
    }
};*/

module.exports = {
    getAreas,
    getOptionsForArea
}