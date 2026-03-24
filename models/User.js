const database = require("../config/database");

const getAllUsers = async () => {
  try {
    const db = database.getConnection();
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const db = database.getConnection();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const getUserAssetsByEmail = async (email) => {
  try {
    const db = database.getConnection();
    const [assetsByUser] = await db.query(
      "SELECT ad.id, ad.asset_code, aty.category, u.name FROM asset_details ad LEFT JOIN asset_types aty ON ad.asset_type_id = aty.id LEFT JOIN users u ON ad.assigned_to = u.id WHERE u.email = ?",
      [email],
    );
    return assetsByUser;
  } catch (error) {
    throw error;
  }
};

const gettingUserNotifications = async (userId) => {
  try {
    const db = database.getConnection();
    const [rows] = await db.query("SELECT r.id, r.type, r.status, r.message, at.category FROM requests r INNER JOIN users u ON r.user_id = u.id INNER JOIN asset_details ad ON r.asset_id = ad.id INNER JOIN asset_types at ON ad.asset_type_id = at.id WHERE r.user_id = ? and r.user_mark_returned = 0", [userId]);
    return rows;
  } catch (error) {
    console.log("error at gettingUserNotifications");
    throw error;
  }
}

const userAssetSubmit = async (notificationId) => {
  try {
    const db = database.getConnection();
    return await db.query(
      "UPDATE requests set user_mark_returned = 1, status = 'user-submitted' where id = ?",
      [notificationId],
    );
  } catch (error) {
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const { email, password } = userData;
    const db = database.getConnection();
    const [result] = await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password],
    );
    return result;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  getAllUsers,
  getUserByEmail,
  createUser,
  getUserAssetsByEmail,
  gettingUserNotifications,
  userAssetSubmit,
};
