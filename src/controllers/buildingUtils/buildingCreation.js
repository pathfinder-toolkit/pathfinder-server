const { Building, Category, ComponentValue, Subject, Component, ComponentMeta } = require('../../models');

const makeNameComponent = async (name) => {


    const component = await makeComponent(subject, 'Name', false, true, 'string', name);

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

const makeComponent = async (subject, componentName, hasSuggestions, isCurrent, valueType, valueString) => {
    const component = Component.build({
        //componentName: componentName,
        //hasSuggestions: hasSuggestions,
        isCurrent: isCurrent,
        componentValueType: valueType
    })

    /*component.setSubject(subject, {save:false});
    await component.save();*/

    let value;

    switch (valueType) {
        case 'string':
            value = ComponentValue.build({
                valueString: valueString
            })
            break;
        default:
            break;
    }
    value.setComponent(component, {save: false});
    await value.save();

    return component;
}

module.exports = {
    makeNameComponent
}