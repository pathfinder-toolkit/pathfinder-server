const checkRecaptcha = async (request, response, next) => {
    console.log(request.body);
    next();
}

const sendFeedback = async (request, response) => {
    response.status(201).send("Your feedback has been sent.")
}

module.exports = {
    checkRecaptcha,
    sendFeedback
}