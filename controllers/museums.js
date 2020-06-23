const Museum = require("../models/Museum");

// @desc    Get all museums
// @route   GET /api/v1/museums
// @access  Public
exports.getMuseums = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all museums" });
};

// @desc    Get single museum
// @route   GET /api/v1/museums/:id
// @access  Public
exports.getMuseum = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get museum ${req.params.id}` });
};

// @desc    Create museum
// @route   POST /api/v1/museums/
// @access  Private
exports.createMuseum = async (req, res, next) => {
  try {
    const museum = await Museum.create(req.body);
    res.status(201).json({ success: true, data: museum });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

// @desc    Update museum by its ID
// @route   PUT /api/v1/museums/:id
// @access  Private
exports.updateMuseum = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update museum ${req.params.id}` });
};

// @desc    Delete museum by its ID
// @route   DELETE /api/v1/museums/:id
// @access  Private
exports.deleteMuseum = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete museum ${req.params.id}` });
};
