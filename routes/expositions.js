const express = require("express");
const { getExpositions } = require("../controllers/expositions");

const router = express.Router({ mergeParams: true });

router.route("/").get(getExpositions);

module.exports = router;
