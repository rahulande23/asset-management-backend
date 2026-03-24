const { getAssetsWithDetails } = require("../models/Asset");
const { getAllUsers, gettingUserNotifications, userAssetSubmit } = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    const asset_details = await getAssetsWithDetails();
    res.status(200).json({users : users, asset_details : asset_details});
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const {userId} = req.params;
    const userNotifications = await gettingUserNotifications(userId);
    res.status(200).json({notifications : userNotifications});
  } catch (error) {
    console.error("Get users requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setAssetsubmitByUser = async (req, res) => {
  try {
    const {notificationId} = req.params;
    await userAssetSubmit(notificationId);
    res.status(200).json({message : "you successfully submited the asset"});
  } catch (error) {
    console.error("Get users requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log(req.user);
    res.json({
      message: "Profile retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  getProfile,
  getUserNotifications,
  setAssetsubmitByUser
};
