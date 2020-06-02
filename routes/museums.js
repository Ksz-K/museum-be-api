const express = require("express");
const {
  getMuseum,
  getMuseums,
  createMuseum,
  updateMuseum,
  deleteMuseum,
} = require("../controllers/museums");
const router = express.Router();

router.route("/").get(getMuseums).post(createMuseum);
router.route("/:id").get(getMuseum).put(updateMuseum).delete(deleteMuseum);

module.exports = router;
