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

const FullBuildingJSONtoResponse = (building) => {
    const responseObject = {};
    responseObject.slug = building.slug;
    responseObject.publicStatus = building.publicStatus

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
            
            const suggestions = component.meta.suggestions;

            suggestions.sort((a,b) => {return b.priority - a.priority});

            // Postgres character limit fix on query;
            for (const loopedSuggestion of suggestions) {
                loopedSuggestion.suggestionSecondarySubject = loopedSuggestion.suggestionSecondarySubje;
            }
            const formattedSuggestions = suggestionsToResponse(suggestions);

            currentComponent.suggestions = formattedSuggestions;

            // If the category already has this component, we want to push the new one to the end of the array
            if (!currentCategory[component.meta.componentName]) {
                currentCategory[component.meta.componentName] = currentComponent.hasSuggestions ? [(currentComponent)] : (currentComponent);
            } else {
                currentCategory[component.meta.componentName].push(currentComponent);
            }
            
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

const suggestionsToResponse = (suggestionList) => {
    const responseList = [];

    for (const suggestion of suggestionList) {
        const formattedSuggestion = {
            idSuggestion: suggestion.idSuggestion,
            suggestionText: suggestion.suggestionText,
            suggestionSubject: suggestion.subject.subject,
            suggestionSecondarySubject: suggestion.suggestionSecondarySubject,
            priority: suggestion.priority
        }
        responseList.push(formattedSuggestion);
    }

    return responseList;
}

const commentsToResponse = (comments, page, pages) => {
    const response = {
        page: page,
        maxPages: pages
    }
    const commentList = [];

    for (const comment of comments) {
        const formattedComment = {
            idComment: comment.idComment,
            commentText: comment.commentText,
            commentSubject: comment.subject.subject,
            commentSecondarySubject: comment.commentSecondarySubject,
            date: comment.createdAt,
            author: comment.commentAuthor,
            sentiment: comment.commentSentiment
        }
        console.log("Formatted: ");
        console.log(formattedComment);
        commentList.push(formattedComment);
    }
    response.comments = commentList;

    return response;
}

module.exports = {
    BuildingJSONtoResponse,
    FullBuildingJSONtoResponse,
    userBuildingListToResponse,
    suggestionsToResponse,
    commentsToResponse
}