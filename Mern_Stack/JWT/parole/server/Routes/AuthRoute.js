const express = require("express");
const { Signup, Login, Logout } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.post("/", userVerification); // <-- For protected routes (e.g., homepage check)

module.exports = router;
