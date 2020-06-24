const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Museum = require("../models/Museum");

// @desc    Get all museums
// @route   GET /api/v1/museums
// @access  Public
exports.getMuseums = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  console.log(queryStr);
  const museums = await Museum.find();
  res.status(200).json({ success: true, count: museums.length, data: museums });
});

// @desc    Get single museum
// @route   GET /api/v1/museums/:id
// @access  Public
exports.getMuseum = asyncHandler(async (req, res, next) => {
  const museum = await Museum.findById(req.params.id);
  if (!museum) {
    return next(
      new ErrorResponse(
        `Muzeum o ID ${req.params.id} nie zostało znalezione`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: museum });
});

// @desc    Create museum
// @route   POST /api/v1/museums/
// @access  Private
exports.createMuseum = asyncHandler(async (req, res, next) => {
  const museum = await Museum.create(req.body);
  res.status(201).json({ success: true, data: museum });
});

// @desc    Update museum by its ID
// @route   PUT /api/v1/museums/:id
// @access  Private
exports.updateMuseum = asyncHandler(async (req, res, next) => {
  const museum = await Museum.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!museum) {
    return next(
      new ErrorResponse(
        `Muzeum o ID ${req.params.id} nie zostało znalezione`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: museum });
});

// @desc    Delete museum by its ID
// @route   DELETE /api/v1/museums/:id
// @access  Private
exports.deleteMuseum = asyncHandler(async (req, res, next) => {
  const museum = await Museum.findByIdAndRemove(req.params.id);

  if (!museum) {
    return next(
      new ErrorResponse(
        `Muzeum o ID ${req.params.id} nie zostało znalezione`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: museum });
});

// @desc    Get museum within a radius
// @route   GET /api/v1/museums/radius/:coordinates/:distance
// @access  Private
exports.getMuseumsInRadius = asyncHandler(async (req, res, next) => {
  const { coordinates, distance } = req.params;

  //Get lat/lng from url
  const lng = coordinates.split("-")[0];
  const lat = coordinates.split("-")[1];

  //Calc radius using radians
  //Divide distance by radius of Earth (3963 miles / 6378 km )
  const radius = distance / 6378;

  const museums = await Museum.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: museums.length,
    data: museums,
  });
});
