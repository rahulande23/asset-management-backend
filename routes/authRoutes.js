const express = require("express");
const router = express.Router();
const {
  createAccount,
  login,
  googleAuth,
  checkToken,
} = require("../controllers/authController");
const { checkingJwtToken } = require("../middleware/auth");

// Auth routes
router.post("/create-account", createAccount);
router.post("/login", login);
router.post("/auth/google", googleAuth);
router.get("/checking-token-on-app-start", checkingJwtToken, checkToken);

module.exports = router;
