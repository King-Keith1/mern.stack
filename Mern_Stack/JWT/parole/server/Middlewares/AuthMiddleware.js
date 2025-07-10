const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

require("dotenv").config();
const TOKEN_KEY = process.env.TOKEN_KEY;

// Middleware for verifying JWT from cookies
module.exports.userVerification = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ status: false, message: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, TOKEN_KEY);

    // Fetch user by ID from decoded payload
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    // Attach user to request (optional, for chaining)
    req.user = user;

    // Respond with success
    return res.json({ status: true, user: user.username });
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.json({ status: false, message: "Token is invalid or expired" });
  }
};
