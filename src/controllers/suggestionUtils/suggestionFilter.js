const db = require('../../models');

const filterBuildingObject = (building) => {
    for (const category of building.categories) {
        for (const component of category.components) {
            if (component.meta.hasSuggestions) {
                component.meta.suggestions = component.meta.suggestions.filter(suggestion => filterSuggestionFromBuilding(suggestion, component, building));
            }
        }
    }
    return building;
}

const filterSuggestionFromBuilding = (suggestion, component, building) => {

    // Filter out suggestions from wrong area
    const buildingArea = building.categories.find(category => category.categoryName === 'details')
                .components.find(component => component.meta.componentName === 'area')
                .value.valueString;
    if (!suggestion.areas.some(area => area.areaName === buildingArea)) {
        return false;
    }
    // Filter out suggestions based on condition - suggestion passes through if all conditions are met
    // Unfinished: Currently assumes the condition is based on same component
    for (const currentCondition of suggestion.conditions) {
        switch (component.meta.componentValueType) {
            case 'string':
                const validOptions = currentCondition.condition.split(',');
                if (!validOptions.some(option => option === component.value.valueString)) {
                    return false;
                }
                break;
            case 'int':
            case 'double':
                const operator = currentCondition.condition.charAt(0);
                const validator = Number(currentCondition.condition.substr(1));
                if (operator === '=') {
                    if ((component.value.valueInt || component.value.valueDouble) === validator ) {
                        break;
                    }
                }
                if (operator === '<') {
                    if ((component.value.valueInt || component.value.valueDouble) < validator ) {
                        break;
                    }
                }
                if (operator === '>') {
                    if ((component.value.valueInt || component.value.valueDouble) > validator ) {
                        break;
                    }
                }
                return false;
            case 'boolean':
                const booleanValidator = currentCondition.condition == "true";
                if (component.value.valueBoolean === booleanValidator) {
                    break;
                }
                return false;
            default:
                return false;
        }
    }
    return true;
}

const filterSuggestion = (suggestion, value) => {
    // Assumes all conditions are based on the same component
    for (const currentCondition of suggestion.conditions) {
        switch (suggestion.subject.componentValueType) {
            case 'string':
                const validOptions = currentCondition.condition.split(',');
                if (!validOptions.some(option => option === value)) {
                    return false;
                }
                break;
            case 'int':
            case 'double':
                const operator = currentCondition.condition.charAt(0);
                const validator = Number(currentCondition.condition.substr(1));
                if (operator === '=') {
                    if (Number(value) == validator ) {
                        break;
                    }
                }
                if (operator === '<') {
                    if (Number(value) < validator ) {
                        break;
                    }
                }
                if (operator === '>') {
                    if (Number(value) > validator ) {
                        break;
                    }
                }
                return false;
            case 'boolean':
                const booleanValidator = currentCondition.condition == "true";
                const booleanValue = value == "true";
                if (booleanValue == booleanValidator) {
                    break;
                }
                return false;
            default:
                return false;
        }
    }
    
    return true;
}

module.exports = {
    filterBuildingObject,
    filterSuggestion
};
