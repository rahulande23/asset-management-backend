const {
  getAllAssets,
  getAssetsWithDetails,
  getAssetTypes,
  getAssetsByUser,
  getAssetsByUserId,
  getAvailableAssets,
  filterByStatus,
  assigningAssetToUser,
  sendingReturnRequest,
  assetReturnedByUser
} = require("../models/Asset");
const { getAllUsers } = require("../models/User");
const { getIO } = require("../socket/socket");

const getDashboard = async (req, res) => {
  try {
    const assets = await getAllAssets();
    const users = await getAllUsers();

    const assigned = filterByStatus(assets, "ASSIGNED");
    const available = filterByStatus(assets, "AVAILABLE");
    const maintenance = filterByStatus(assets, "MAINTENANCE");
    const retired = filterByStatus(assets, "RETIRED");

    res.json({
      message: "token verified",
      assigned: assigned,
      available: available,
      maintenance: maintenance,
      retired: retired,
      employees: users.length,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error occurred" });
  }
};

const getAssets = async (req, res) => {
  try {
    const assetTypes = await getAssetTypes();
    const allAssets = await getAssetsWithDetails();

    res.status(200).json({
      assetTypes: assetTypes,
      allAssets: allAssets,
    });
  } catch (error) {
    console.error("Get assets error:", error);
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

const getAssignPage = async (req, res) => {
  try {
    const users = await getAllUsers();
    const availableAssets = await getAvailableAssets();

    res.status(200).json({
      users: users,
      availableAssets: availableAssets,
    });
  } catch (error) {
    console.error("Get assign page error:", error);
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};


const getUserAssets = async (req, res) => {
  try {
    const { userId } = req.params;
    const userAssets = await getAssetsByUserId(userId);

    console.log(userAssets);
    res.status(200).json({
      assets: userAssets,
    });
  } catch (error) {
    console.error("Get user assets error:", error);
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

const assigningAsset = async (req, res) => {
  try {
    const { userId, assetId, notes } = req.body;
    const assetAssigned = await assigningAssetToUser(userId, assetId, notes);

    getIO().emit("asset-assigned", {
      userId,
      assetId,
      notes,
    });

    res.status(200).json({ assetAssigned: assetAssigned });
  } catch (error) {
    console.error("error while assigning asset to employee:", error);
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

const returnAsset = async (req, res) => {
  try {
    const { userId, assetId } = req.body;
    const sendingRequest = await sendingReturnRequest(userId, assetId);
    if(sendingRequest == "duplicate-request")
    {
      res.status(200).json({message : "duplicate-request"});
      return;
    }
    getIO()
      .to(`user-${userId}`)
      .emit("return-asset-notification", userId,
        assetId,);

    res.status(200).json(sendingRequest);
  } catch (error) {
    console.error("error while assigning asset to employee:", error);
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

const userReturningAsset = async (req, res) => {
  try{
    const assetId = req.params.assetId;
    const {userId} = req.body;
    await assetReturnedByUser(assetId, userId);
    res.status(200).json({message : "succesfully we took back our asset"})
  }
  catch(error)
  {
    throw error;
  }
}


module.exports = {
  getDashboard,
  getAssets,
  getAssignPage,
  getUserAssets,
  assigningAsset,
  returnAsset,
  userReturningAsset
};
