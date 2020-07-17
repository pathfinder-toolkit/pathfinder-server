const db = require('../models');
const { Material, RoofType, VentilationType, HeatingType, BuildingType, ComponentMeta, AreaComponent, AreaOption } = require('../models');

const sequelize = db.sequelize;
const Area = db.Area;

const createDummyDataForAreas = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const baseComponents = await ComponentMeta.findAll({
            attributes: ["componentName"],
            where: {
                hasSuggestions: true
            }
        });

        const areas = await Area.findAll({
            attributes:  ['idArea']
        });

        for (const area of areas) {
            let components = [];
            for (const baseComponent of baseComponents) {
                let options = [];
                let amount = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < amount; i++) {
                    const option = await AreaOption.create({
                        option: `${baseComponent.componentName} ${i + 1}`
                    },
                    {transaction: t});
                    console.log(option.toJSON());
                    options.push(option);
                }
                const component = await AreaComponent.create({
                    identifier: baseComponent.componentName
                },
                {transaction: t});
                await component.addOptions(options, {transaction: t});
                console.log(component.toJSON());
                components.push(component)
            }
            await area.addIdentifiers(components, {transaction: t});
            
        }

        t.commit();
        response.status(200).send("OK!");
    } catch (error) {
        t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const getAreas = async (request, response) => {
    try {
        const areas = await Area.findAll({
            attributes:  ['areaName', 'idArea']
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

module.exports = {
    getAreas,
    getOptionsForArea,
}