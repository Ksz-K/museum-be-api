const express = require("express");
const {
  getMuseum,
  getMuseums,
  createMuseum,
  updateMuseum,
  deleteMuseum,
  getMuseumsInRadius,
} = require("../controllers/museums");

const router = express.Router();

router.route("/radius/:coordinates/:distance").get(getMuseumsInRadius);

router.route("/").get(getMuseums).post(createMuseum);

router.route("/:id").get(getMuseum).put(updateMuseum).delete(deleteMuseum);

module.exports = router;
