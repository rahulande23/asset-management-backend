const jwt = require("jsonwebtoken");
const config = require("../config/config");

const checkingJwtToken = async (req, res, next) => {
  try {
    const tokenContains = req.headers.authorization;
    if (!tokenContains) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = tokenContains.split(" ")[1];
    const claims = jwt.verify(token, config.JWT_SECRET);
    req.user = claims;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

module.exports = {
  checkingJwtToken,
};
