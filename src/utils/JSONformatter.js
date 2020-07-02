const BuildingJSONtoResponse = (building) => {
    const responseObject = {};
    responseObject.slug = building.slug;

    building['categories'].map((category, index) => {
        const currentCategory = {};
        
        category.components.map((component, index) => {
            const currentComponent = {};
            currentComponent.componentDescription = component.meta.componentDescription;
            let value;
            Object.keys(component.value).map((valueType) => {
                if (component.value[valueType] != null) {
                    value = component.value[valueType];
                }
            })
            currentComponent.value = value;
            currentComponent.hasSuggestions = component.meta.hasSuggestions;
            currentComponent.isCurrent = component.isCurrent;
            currentComponent.usageStartYear = component.usageStartYear;
            currentCategory[component.meta.componentName] = currentComponent.hasSuggestions ? [(currentComponent)] : (currentComponent);
        });
        responseObject[category.categoryName] = currentCategory;
    });

    return responseObject;
}

module.exports = {
    BuildingJSONtoResponse
}