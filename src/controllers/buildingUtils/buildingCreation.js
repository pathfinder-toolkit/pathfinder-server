const { Building, Category, ComponentValue, Subject, Component, ComponentMeta } = require('../../models');

const buildingModel = require('../../json/buildingModel.json');

const makeNameComponent = async (name) => {


    const component = {};

    return component;

    /*const component = Component.build({
        componentName: 'Name',
        hasSuggestions: false,
        isCurrent: true,
        componentValueType: 'string'
    });
    
    component.setSubject(subject, {save: false});
    await component.save();

    const value = ComponentValue.build({
        valueString: name
    });

    value.setComponent(component, {save: false});
    await value.save();
    return component;*/
}

const makeAreaComponent = async (area) => {

}

const makeComponent = async ( componentName, value, valueType, isCurrent ) => {
    const meta = await ComponentMeta.findOne({
        where: {
            componentName: componentName
        }
    });

    const valueTypeTest = meta.componentValueType;
    console.log(valueTypeTest);
    //console.log(meta);
    
    const component = Component.build({
        isCurrent: isCurrent,
        componentValueType: valueType
    })

    //console.log(component);
    

    component.setMeta(meta, {save:false});
    await component.save();

    let valueObject;

    switch (valueType) {
        case 'string':
            valueObject = ComponentValue.build({
                valueString: value
            })
            break;
        default:
            break;
    }
    valueObject.setComponent(component, {save: false});
    await valueObject.save();

    return component;
}

const makeMetaComponents = async () => {
    /*const meta = await ComponentMeta.create({
        componentDescription: "Name",
        componentName: "name",
        componentValueType: "string",
        hasSuggestions: true,
        subject: "No subject"
    });*/

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

module.exports = {
    makeComponent,
    makeMetaComponents
}