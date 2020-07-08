const express = require("express");
const buildingRouter = express.Router();

const {
  checkJwt
} = require('../utils/auth');

const {
  getSampleBuilding,
  postBuildingFromData,
  getBuildingsForUser,
  getFullBuildingDetailsFromSlug
} = require('../controllers/buildingController');

buildingRouter.get("/building", getSampleBuilding);

buildingRouter.post("/building", checkJwt, postBuildingFromData);

buildingRouter.get("/buildings/me", checkJwt,  getBuildingsForUser);

buildingRouter.get("/building/:slug", checkJwt, getFullBuildingDetailsFromSlug);

module.exports = buildingRouter;