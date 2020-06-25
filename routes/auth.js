const express = require("express");
const { register } = require("../controllers/auth");

const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router.post("/register", register);

module.exports = router;
