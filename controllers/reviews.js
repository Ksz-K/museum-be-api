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
    const reviews = await Review.find({ museum: req.params.museumId });
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

// @desc    Create review
// @route   POST /api/v1/museum/:museumId/reviews/
// @access  Private

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.museum = req.params.museumId;
  req.body.user = req.user.id;

  const museum = await Museum.findById(req.params.museumId);

  if (!museum) {
    return next(
      new ErrorResponse(
        `Muzeum o ID ${req.params.museumId} nie została znalezione`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `Opinia o ID ${req.params.museumId} nie została znaleziona`,
        404
      )
    );
  }

  //Check if review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Użytkownik o ID ${req.user.id} nie ma uprawnień do edycji tej opinii`,
        404
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});
// @desc    Delete review
// @route   Delete /api/v1/reviews/:id
// @access  Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `Opinia o ID ${req.params.id} nie została znaleziona`,
        404
      )
    );
  }

  //Check if review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Użytkownik o ID ${req.user.id} nie ma uprawnień do edycji tej opinii`,
        404
      )
    );
  }

  await review.remove();

  res.status(201).json({
    success: true,
    data: review,
  });
});
