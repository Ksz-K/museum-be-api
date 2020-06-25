const express = require("express");
const {
  getExpositions,
  getExposition,
  addExposition,
  updateExposition,
  deleteExposition,
} = require("../controllers/expositions");

const Exposition = require("../models/Exposition");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Exposition, { path: "museum", select: "name description" }),
    getExpositions
  )
  .post(addExposition);
router
  .route("/:id")
  .get(getExposition)
  .put(updateExposition)
  .delete(deleteExposition);
module.exports = router;
