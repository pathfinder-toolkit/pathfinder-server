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
    // Filter out suggestions based on condition
    // Unfinished: Currently assumes the condition is based on same component
    for (const currentCondition of suggestion.conditions) {
        switch (component.meta.componentValueType) {
            case 'string':
                const validOptions = currentCondition.condition.split(',');
                if (!validOptions.some(option => option === component.value.valueString)) {
                    return false;
                }
                break;
            default:
                break;
        }
    }
    return true;
}

module.exports = {
    filterBuildingObject
};
