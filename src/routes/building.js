const express = require("express");
const buildingRouter = express.Router();

const {
  checkJwt
} = require('../utils/auth');

const {
  getSampleBuilding,
  postBuildingFromData,
  getBuildingsForUser,
  getFullBuildingDetailsFromSlug,
  checkOwnerStatus,
  checkOwnerOrAdminStatus,
  updateBuildingData,
  deleteBuilding,
  updateBuildingPublicityStatus,
  checkPublicStatus,
  getPublicBuilding
} = require('../controllers/buildingController');

buildingRouter.get("/building", getSampleBuilding);

buildingRouter.post("/building", checkJwt, postBuildingFromData);

buildingRouter.get("/buildings/me", checkJwt,  getBuildingsForUser);

buildingRouter.get("/building/:slug", checkJwt, getFullBuildingDetailsFromSlug);

buildingRouter.put("/building/:slug", checkJwt, checkOwnerStatus, updateBuildingData);

buildingRouter.patch("/building/:slug", checkJwt, checkOwnerStatus, updateBuildingPublicityStatus);

buildingRouter.delete("/building/:slug", checkJwt, checkOwnerOrAdminStatus, deleteBuilding);

buildingRouter.get("/building/public/:slug", checkPublicStatus, getPublicBuilding);

module.exports = buildingRouter;