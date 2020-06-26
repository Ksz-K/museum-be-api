const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require("../controllers/auth");

const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

//Middleware for protecting some routes (private ones)
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);

module.exports = router;
