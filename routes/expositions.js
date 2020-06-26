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

//Middleware for protecting some routes (private ones)
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Exposition, { path: "museum", select: "name description" }),
    getExpositions
  )
  .post(protect, authorize("publisher", "admin"), addExposition);
router
  .route("/:id")
  .get(getExposition)
  .put(protect, authorize("publisher", "admin"), updateExposition)
  .delete(protect, authorize("publisher", "admin"), deleteExposition);

module.exports = router;
