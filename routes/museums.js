const express = require("express");
const {
  getMuseum,
  getMuseums,
  createMuseum,
  updateMuseum,
  deleteMuseum,
  getMuseumsInRadius,
  museumPhotoUpload,
} = require("../controllers/museums");

const Museum = require("../models/Museum");
const advancedResults = require("../middleware/advancedResults");

//Include other resource routers
const expositionRouter = require("./expositions");
const reviewRouter = require("./reviews");

const router = express.Router();

//Middleware for protecting some routes (private ones)
const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:museumId/expositions", expositionRouter);
router.use("/:museumId/reviews", reviewRouter);

router.route("/radius/:coordinates/:distance").get(getMuseumsInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), museumPhotoUpload);

router
  .route("/")
  .get(advancedResults(Museum, "expositions"), getMuseums)
  .post(protect, authorize("publisher", "admin"), createMuseum);

router
  .route("/:id")
  .get(getMuseum)
  .put(protect, authorize("publisher", "admin"), updateMuseum)
  .delete(protect, authorize("publisher", "admin"), deleteMuseum);

module.exports = router;
