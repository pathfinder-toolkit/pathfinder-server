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
            where: {
                idArea: request.params.area
            },
            attributes: [],
            include: {
                model: AreaComponent,
                as: 'components',
                attributes: [['identifier','componentName']],
                include: {
                    model: AreaOption,
                    as: 'options',
                    attributes: ['option']
                }
            }
        })

        const areaJSON = selectedArea.toJSON();
        for (const component of areaJSON.components) {
            component.options = component.options.map(option => option.option)
        }
        response.status(200).json(areaJSON);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

module.exports = {
    getAreas,
    getOptionsForArea
}