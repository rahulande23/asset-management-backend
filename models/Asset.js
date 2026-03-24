const database = require("../config/database");

const getAllAssets = async () => {
  try {
    const db = database.getConnection();
    const [rows] = await db.query("SELECT * FROM asset_details");
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAssetTypes = async () => {
  try {
    const db = database.getConnection();
    const [rows] = await db.query("SELECT category FROM asset_types");
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAvailableAssets = async () => {
  try {
    const db = database.getConnection();
    const [rows] = await db.query(
      "SELECT ad.id, ad.asset_code, aty.category, ad.status FROM asset_details ad LEFT JOIN asset_types aty ON ad.asset_type_id = aty.id WHERE ad.status = ? and ad.is_deleted = 0;",
      ["Available"],
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const assigningAssetToUser = async (userId, assetId, notes) => {
  try {
    const db = database.getConnection();
    const query = "UPDATE asset_details set assigned_to = ?, status = 'Assigned' , notes = ? where id = ?";
    const [rows] = await db.query(query, [userId, notes, assetId]);
    return rows;
  } catch (e) {
    return e;
  }
}

const sendingReturnRequest = async (userId, assetId) => {
  try {
    const db = database.getConnection();
    const [req] = await db.query("SELECT r.id, r.user_id, r.asset_id, r.type, r.status, r.message, at.category FROM requests r INNER JOIN users u ON r.user_id = u.id INNER JOIN asset_details ad ON r.asset_id = ad.id INNER JOIN asset_types at ON ad.asset_type_id = at.id WHERE r.user_id = ?", [userId]);
    console.log(req);
    if (req.find(req => req.asset_id == assetId && req.type == "return-asset")) {
      console.log("this is a duplicate request");
      return "duplicate-request";
    }
    const query = "INSERT INTO requests (user_id, asset_id, type, status, message) VALUES(?, ?, ?, ?, ?)";
    const [rows] = await db.query(query, [userId, assetId, "return-asset", "pending", "you are ordered to return the asset : "]);
    return rows;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

const getAssetsWithDetails = async () => {
  try {
    const db = database.getConnection();
    const query = `
      SELECT ad.id, ad.asset_code, aty.category, ad.status, u.name, u.email, ad.purchased_date 
      FROM asset_details ad 
      LEFT JOIN asset_types aty ON ad.asset_type_id = aty.id 
      LEFT JOIN users u ON ad.assigned_to = u.id
    `;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAssetsByUser = async (email) => {
  try {
    const db = database.getConnection();
    const query = `
      SELECT ad.id, ad.asset_code, aty.category, u.name 
      FROM asset_details ad 
      LEFT JOIN asset_types aty ON ad.asset_type_id = aty.id 
      LEFT JOIN users u ON ad.assigned_to = u.id 
      WHERE u.email = ?
    `;
    const [rows] = await db.query(query, [email]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAssetsByUserId = async (userId) => {
  try {
    const db = database.getConnection();
    const query = `
      SELECT ad.id, ad.asset_code, aty.category, ad.status, ad.purchased_date
      FROM asset_details ad 
      LEFT JOIN asset_types aty ON ad.asset_type_id = aty.id 
      LEFT JOIN users u ON ad.assigned_to = u.id
      WHERE ad.assigned_to = ?
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const assetReturnedByUser = async (assetId, userId) => {
  try {
    const db = database.getConnection();
    await db.query(
      'UPDATE asset_details SET status = "available", assigned_to = null WHERE id = ?',
      [assetId]
    );
    const [rows] = await db.query(
      'SELECT r.id FROM requests r INNER JOIN users u ON r.user_id = u.id INNER JOIN asset_details ad ON r.asset_id = ad.id WHERE r.user_id = ? AND ad.id = ?',
      [userId, assetId]
    );
    if (rows.length > 0) {
      const requestId = rows[0].id;
      await db.query('DELETE FROM requests WHERE id = ?', [requestId]);
    }
    return true;
  } catch (error) {
    throw error;
  }
};


const filterByStatus = (assets, status) => {
  return assets.filter(
    (asset) => asset.status.toLowerCase() === status.toLowerCase(),
  );
};

module.exports = {
  getAllAssets,
  getAssetsWithDetails,
  getAvailableAssets,
  getAssetTypes,
  getAssetsByUser,
  getAssetsByUserId,
  filterByStatus,
  assigningAssetToUser,
  sendingReturnRequest,
  assetReturnedByUser
};
