const { Building, Category, ComponentValue, Component, ComponentMeta } = require('../../models');

const { Op } = require("sequelize");

const buildingModel = require('../../json/buildingModel.json');

const makeComponent = async ( componentName, value, isCurrent ) => {
    const meta = await ComponentMeta.findOne({
        where: {
            componentName: componentName
        }
    });
    
    const component = Component.build({
        isCurrent: isCurrent,
    })

    component.setMeta(meta, {save:false});
    await component.save();

    let valueObject;

    const valueType = meta.componentValueType;

    switch (valueType) {
        case 'string':
            valueObject = ComponentValue.build({
                valueString: value
            });
            break;
        case 'date':
            valueObject = ComponentValue.build({
                valueDate: value
            });
            break;
        case 'int':
            valueObject = ComponentValue.build({
                valueInt: value
            });
            break;
        case 'double':
            valueObject = ComponentValue.build({
                valueDouble: value
            });
            break;
        case 'boolean':
            valueObject = ComponentValue.build({
                valueBoolean: value
            });
            break;
        case 'text':
            valueObject = ComponentValue.build({
                valueText: value
            });
            break;
        default:
            break;
    }

    valueObject.setComponent(component, {save: false});
    await valueObject.save();

    return component;
}

const makeComponentWithTransaction = async ( componentName, value, isCurrent, t, usageStartYear = 2020) => {
    const meta = await ComponentMeta.findOne({
        where: {
            componentName: componentName
        }
    });
    
    const component = Component.build({
        isCurrent: isCurrent,
        usageStartYear: usageStartYear
    })

    component.setMeta(meta, {save:false});
    await component.save({ transaction: t });

    let valueObject;

    const valueType = meta.componentValueType;

    switch (valueType) {
        case 'string':
            valueObject = ComponentValue.build({
                valueString: value
            });
            break;
        case 'date':
            valueObject = ComponentValue.build({
                valueDate: value
            });
            break;
        case 'int':
            valueObject = ComponentValue.build({
                valueInt: value
            });
            break;
        case 'double':
            valueObject = ComponentValue.build({
                valueDouble: value
            });
            break;
        case 'boolean':
            valueObject = ComponentValue.build({
                valueBoolean: value
            });
            break;
        case 'text':
            valueObject = ComponentValue.build({
                valueText: value
            });
            break;
        default:
            break;
    }

    valueObject.setComponent(component, {save: false});
    await valueObject.save({ transaction: t });

    return component;
}

const makeMetaComponents = async () => {

    console.log(buildingModel);

    for (category in buildingModel) {

        for (property in buildingModel[category]) {
            let metaObject = {};
            metaObject.componentName = property;
            if (Array.isArray(buildingModel[category][property])) {
                metaObject.componentDescription = buildingModel[category][property][0].propertyName;
                metaObject.componentValueType = buildingModel[category][property][0].valueType;
                metaObject.hasSuggestions = buildingModel[category][property][0].hasSuggestions;
                metaObject.subject = buildingModel[category][property][0].subject;
            } else {
                metaObject.componentDescription = buildingModel[category][property].propertyName;
                metaObject.componentValueType = buildingModel[category][property].valueType;
                metaObject.hasSuggestions = buildingModel[category][property].hasSuggestions;
                metaObject.subject = buildingModel[category][property].subject;
            }

            const meta = await ComponentMeta.create(metaObject);

                
            console.log(metaObject);
            console.log(JSON.stringify(meta, null, 4));
        }
    }
}

const postTestBuilding = async () => {
    console.log(buildingModel);

    const building = await Building.create({
        buildingAuthorSub: 'noauthor',
        slug: 'exampleslug'
    })

    for (category in buildingModel) {
        const currentCategory = await Category.create({
            categoryName: category
        })
        console.log(currentCategory.toJSON());
        for (property in buildingModel[category]) {
            const componentName = property;
            const value = Array.isArray(buildingModel[category][property]) ? 
                (buildingModel[category][property][0].value) : 
                (buildingModel[category][property].value);
            const isCurrent = true;

            console.log(componentName, value, isCurrent);

            const component = await makeComponent(componentName, value, isCurrent);


            await currentCategory.addComponent(component);
        }
        await building.addCategory(currentCategory);
    }
}

const checkSlug = async (slug) => {
    let verifiedSlug = slug;
    console.log("slug: " + slug);
    const buildingWithSlug = await Building.findOne({
        where: {
            slug: slug
        }
    });
    if (buildingWithSlug) {
        let count = await Building.count({
            where: {
                slug: {
                    [Op.startsWith]: slug + "-"
                }
            }
        })
        console.log(count);
        count = count + 2;
        verifiedSlug = slug + "-" + count;
    }
    console.log("verified slug: " + verifiedSlug);
    return verifiedSlug;
}

module.exports = {
    makeComponent,
    makeComponentWithTransaction,
    makeMetaComponents,
    postTestBuilding,
    checkSlug
}