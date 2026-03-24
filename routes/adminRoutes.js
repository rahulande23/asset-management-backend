const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getAssets,
  getAssignPage,
  getUserAssets,
  assigningAsset,
  returnAsset,
} = require("../controllers/assetsController");
const { getUsers } = require("../controllers/userController");
const { checkingJwtToken } = require("../middleware/auth");

// Admin routes - all protected with JWT middleware
router.get("/dashboard", checkingJwtToken, getDashboard);
router.get("/assets", checkingJwtToken, getAssets);
router.get("/users", checkingJwtToken, getUsers);
router.get("/assign", checkingJwtToken, getAssignPage);
router.get("/user-assets/:userId", checkingJwtToken, getUserAssets);
router.post("/assign/confirmAsset", checkingJwtToken, assigningAsset);
router.post("/assign/returnAsset", checkingJwtToken, returnAsset);

module.exports = router;
