const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const TOKEN_KEY = process.env.TOKEN_KEY;

// ========== SIGNUP ==========
module.exports.Signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      TOKEN_KEY,
      { expiresIn: "3d" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, // true if using HTTPS
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.status(201).json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed", error });
  }
};

// ========== LOGIN ==========
module.exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Incorrect email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      TOKEN_KEY,
      { expiresIn: "3d" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, // true in production
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error });
  }
};

// ========== LOGOUT (Optional) ==========
module.exports.Logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully", success: true });
};