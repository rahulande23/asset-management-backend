const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { getUserByEmail, createUser } = require("../models/User");
const config = require("../config/config");

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const createAccount = async (req, res) => {
  try {
    console.log("Creating account");
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({ email, password: hashedPassword });

    res.status(201).json({
      message: "Account created successfully",
      password: hashedPassword,
    });
  } catch (error) {
    console.error("Create account error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await getUserByEmail(email.toLowerCase());

    if (!user) {
      return res.status(404).json({
        status: "user not found or invalid username entered!",
      });
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);

    if (true) {
      const token = jwt.sign(user, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
      });

      console.log("Token created:", token);

      res.json({
        status: "login success",
        token: token,
        user: user,
      });
    } else {
      res.status(401).json({
        status: "wrong password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(403).json({
        message: "You are not authorized to access this application",
      });
    }

    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN },
    );

    res.json({
      token: jwtToken,
      role: user.role,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
};

const checkToken = async (req, res) => {
  try {
    console.log("Token check called by frontend");
    res.json({
      status: "login success",
      role: req.user.role,
    });
  } catch (error) {
    console.error("Token check error:", error);
    res.status(401).json({ message: "Token validation failed" });
  }
};

module.exports = {
  createAccount,
  login,
  googleAuth,
  checkToken,
};
