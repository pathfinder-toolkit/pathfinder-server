const { Building, Category, ComponentValue, Component, ComponentMeta } = require('../../models');

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

module.exports = {
    makeComponent,
    makeMetaComponents,
    postTestBuilding
}