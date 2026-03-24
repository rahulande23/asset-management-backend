const express = require('express');
const { checkingJwtToken } = require('../middleware/auth');
const { getUserAssets, userReturningAsset} = require('../controllers/assetsController');
const { getUserNotifications, getProfile, setAssetsubmitByUser } = require('../controllers/userController');
const router = express.Router();

router.get("/dashboard", checkingJwtToken, getProfile);
router.get("/assets/:userId", checkingJwtToken, getUserAssets);
router.get("/notifications/:userId", checkingJwtToken, getUserNotifications);
router.put("/notifications/:notificationId/submit", checkingJwtToken, setAssetsubmitByUser);
router.put("/assets/:assetId/return", checkingJwtToken, userReturningAsset)

module.exports = router;