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

const userBuildingListToResponse = (buildingList) => {
    const responseList = [];
    buildingList.map((building) => {
        building = building.toJSON();
        let currentBuilding = {};
        currentBuilding.slug = building.slug;
        currentBuilding.creationDate = building.creationDate;
        building.categories[0].components.map((component) => {
            if (component.meta.componentName == 'name') {
                currentBuilding.name = component.value.value;
            }
            if (component.meta.componentName == 'image') {
                currentBuilding.image = component.value.value;
            }
        })
        responseList.push(currentBuilding);
    })
    console.log(responseList);
    return responseList;
}

module.exports = {
    BuildingJSONtoResponse,
    userBuildingListToResponse
}