const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Museum = require("../models/Museum");

// @desc    Get all museums
// @route   GET /api/v1/museums
// @access  Public
exports.getMuseums = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  //Add user to req.body
  req.body.user = req.user;

  //Check for published museums
  const publishedMuseum = await Museum.findOne({ user: req.user.id });

  //If user is not an admin the maximum bootcamps allowed to create is 1
  if (!publishedMuseum.bootcamp && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `Użytkownik o ID ${req.user.id} posiada już swoje Muzeum.`,
        400
      )
    );
  }

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
  const museum = await Museum.findById(req.params.id);

  if (!museum) {
    return next(
      new ErrorResponse(
        `Muzeum o ID ${req.params.id} nie zostało znalezione`,
        404
      )
    );
  }
  museum.remove();
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

// @desc    Upload photo for museum
// @route   PUT /api/v1/museums/:id/photo
// @access  Private
exports.museumPhotoUpload = asyncHandler(async (req, res, next) => {
  const museum = await Museum.findById(req.params.id);

  if (!museum) {
    return next(
      new ErrorResponse(
        `Muzeum o ID ${req.params.id} nie zostało znalezione`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Proszę dołączyć zdjęcie muzeum`, 400));
  }

  const file = req.files.file;

  //Make sure the image is actual a photo
  if (!file.mimetype.startsWith("image"))
    return next(new ErrorResponse(`Proszę dołączyć zdjęcie muzeum`, 400));

  //Make sure file size does not exceed a limit
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Proszę dołączyć zdjęcie nie większe niż ${process.env.MAX_FILE_UPLOAD} bajtów`,
        400
      )
    );
  }

  //Create custom filename
  file.name = `photo_${museum._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(`Wystąpił problem z załadowaniem pliku`, 500)
      );
    }

    await Museum.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
