const express = require("express");
const { getReviews, getReview } = require("../controllers/reviews");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

//Middleware for protecting some routes (private ones)
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, { path: "museum", select: "name description" }),
    getReviews
  );

router.route("/:id").get(getReview);

module.exports = router;
