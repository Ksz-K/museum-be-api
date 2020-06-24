const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Museum = require("../models/Museum");

// @desc    Get all museums
// @route   GET /api/v1/museums
// @access  Public
exports.getMuseums = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators ($gt,$lt etc.)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = Museum.find(JSON.parse(queryStr));

  //Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Museum.countDocuments();
  query = query.skip(startIndex).limit(limit);

  //Executing query
  const museums = await query;

  //Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(200)
    .json({ success: true, count: museums.length, pagination, data: museums });
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
