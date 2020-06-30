const { Building, Category, ComponentValue, Subject, Component, ComponentMeta } = require('../../models');

const makeNameComponent = async (name) => {


    const component = await makeComponent('name', true, 'string', name);

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

const makeComponent = async (componentName, isCurrent, valueType, value) => {
    const meta = await ComponentMeta.findOne({
        where: {
            componentName: componentName
        }
    });

    console.log(meta);
    
    const component = Component.build({
        isCurrent: isCurrent,
        componentValueType: valueType
    })

    console.log(component);
    

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

module.exports = {
    makeNameComponent
}