const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Exposition = require("../models/Exposition");

// @desc    Get all expositions
// @route   GET /api/v1/expositions
// @route   GET /api/v1/museums/:museumId/expositions
// @access  Public

exports.getExpositions = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.museumId) {
    query = Exposition.find({ museum: req.params.museumId });
  } else {
    query = Exposition.find();
  }

  const expositions = await query;

  res.status(200).json({
    succes: true,
    count: expositions.length,
    data: expositions,
  });
});
