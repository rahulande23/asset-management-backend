module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  PORT: process.env.PORT || 5000,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
};
