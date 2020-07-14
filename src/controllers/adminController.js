const db = require('../models');

const verifyAdminStatus = async (request, response) => {
    console.log(request.user);
    if (request.user["https://pathfinder-toolkit.herokuapp.com/roles"].includes("Admin")) {
        response.status(200).send("Verified");
    } else {
        response.status(401).send("Unauthorized");
    }
};

module.exports = {
    verifyAdminStatus
}