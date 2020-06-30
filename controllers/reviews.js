const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Museum = require("../models/Museum");

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/museums/:museumId/reviews
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.museumId) {
    const reviews = await Museum.find({ museum: req.params.museumId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single reviews
// @route   GET /api/v1/reviews/:id
// @access  Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "museum",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(
        `Opinia o ID ${req.params.id} nie została znalezione`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});
