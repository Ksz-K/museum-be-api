const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Exposition = require("../models/Exposition");
const Museum = require("../models/Museum");

// @desc    Get all expositions
// @route   GET /api/v1/expositions
// @route   GET /api/v1/museums/:museumId/expositions
// @access  Public

exports.getExpositions = asyncHandler(async (req, res, next) => {
  if (req.params.museumId) {
    const expositions = await Exposition.find({ museum: req.params.museumId });
    return res.status(200).json({
      success: true,
      count: expositions.length,
      data: expositions,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single exposition
// @route   GET /api/v1/expositions:/id
// @access  Public

exports.getExposition = asyncHandler(async (req, res, next) => {
  const exposition = await Exposition.findById(req.params.id);

  if (!exposition) {
    return next(
      new ErrorResponse(
        `Wystawa o numerze ID ${req.params.id} nie istnieje`,
        404
      )
    );
  }
  res.status(200).json({
    succes: true,
    data: exposition,
  });
});

// @desc    Add single exposition
// @route   POST /api/v1/museums/:museumId/expositions
// @access  Private

exports.addExposition = asyncHandler(async (req, res, next) => {
  req.body.museum = req.params.museumId;

  const museum = await Museum.findById(req.params.museumId);

  if (!museum) {
    return next(
      new ErrorResponse(
        `Muzeum o numerze ID ${req.params.museumId} nie istnieje`,
        404
      )
    );
  }

  const exposition = await Exposition.create(req.body);

  res.status(200).json({
    succes: true,
    data: exposition,
  });
});

// @desc    Update exposition
// @route   PUT /api/v1/expositions/:id
// @access  Private

exports.updateExposition = asyncHandler(async (req, res, next) => {
  let exposition = await Exposition.findById(req.params.id);

  if (!exposition) {
    return next(
      new ErrorResponse(
        `Wystawa o numerze ID ${req.params.museumId} nie istnieje`,
        404
      )
    );
  }
  exposition = await Exposition.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    succes: true,
    data: exposition,
  });
});

// @desc    Update exposition
// @route   Delete /api/v1/expositions/:id
// @access  Private

exports.deleteExposition = asyncHandler(async (req, res, next) => {
  let exposition = await Exposition.findById(req.params.id);

  if (!exposition) {
    return next(
      new ErrorResponse(
        `Wystawa o numerze ID ${req.params.museumId} nie istnieje`,
        404
      )
    );
  }
  exposition = await Exposition.findByIdAndRemove(req.params.id);

  res.status(200).json({
    succes: true,
    data: exposition,
  });
});
